import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";

const KAABA = {
  latitude: 21.4225,
  longitude: 39.8262,
};

const DIAL_SIZE = 260;
const DIAL_RADIUS = DIAL_SIZE / 2;
const RING_THICKNESS = 16;
const OUTER_SIZE = DIAL_SIZE + RING_THICKNESS * 2;
const OUTER_RADIUS = OUTER_SIZE / 2;

const CARDINALS = [
  { label: "N", angle: 0 },
  { label: "E", angle: 90 },
  { label: "S", angle: 180 },
  { label: "W", angle: 270 },
];

// Shortest signed distance from `from` to `to` on a 0-360 circle, e.g. 359 -> 1 is +2, not -358.
function shortestDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

// Position of a point at `angle` degrees (0 = top, clockwise) and `radius`
// from the center of a box of size `boxSize`.
function pointOnCircle(angle, radius, boxSize) {
  const rad = (angle * Math.PI) / 180;
  const center = boxSize / 2;
  return {
    x: center + radius * Math.sin(rad),
    y: center - radius * Math.cos(rad),
  };
}

export default function App() {
  const [heading, setHeading] = useState(0);
  const [qibla, setQibla] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState("Getting Location...");

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Tracks the *unbounded* rotation actually applied to rotateAnim so the
  // dial always takes the short way around instead of spinning 350°
  // whenever the heading wraps past 0/360.
  const appliedRotationRef = useRef(0);
  const smoothedHeadingRef = useRef(0);

  useEffect(() => {
    let headingSubscription;
    let cancelled = false;

    async function init() {
      const { status: permission } =
        await Location.requestForegroundPermissionsAsync();

      if (permission !== "granted") {
        if (!cancelled) setStatus("Location Permission Denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const bearing = calculateQibla(
        location.coords.latitude,
        location.coords.longitude
      );

      if (cancelled) return;
      setQibla(bearing);
      setStatus("Ready");

      try {
        headingSubscription = await Location.watchHeadingAsync((data) => {
          const raw =
            data.trueHeading >= 0 ? data.trueHeading : data.magHeading;

          smoothedHeadingRef.current = smoothAngle(
            smoothedHeadingRef.current,
            raw
          );

          setHeading(Math.round(smoothedHeadingRef.current));
          setAccuracy(data.accuracy);
        });
      } catch (e) {
        setStatus("Compass Not Available");
      }
    }

    init();

    return () => {
      cancelled = true;
      headingSubscription && headingSubscription.remove();
    };
  }, []);

  // The whole dial rotates opposite to heading — a fixed-bearing point (N,
  // or the Kaaba marker sitting at `qibla`) always appears at screen angle
  // (bearing - heading), which puts it at the top exactly when you're
  // pointed at that bearing. Verified against the "face east -> north is
  // to your left" real-world check.
  useEffect(() => {
    const target = ((-heading % 360) + 360) % 360;
    const currentMod = ((appliedRotationRef.current % 360) + 360) % 360;
    const delta = shortestDelta(currentMod, target);
    const newRotation = appliedRotationRef.current + delta;
    appliedRotationRef.current = newRotation;

    Animated.timing(rotateAnim, {
      toValue: newRotation,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  const diff = Math.abs(shortestDelta(heading, qibla));
  const aligned = diff <= 5;
  const needsCalibration = accuracy === -1 || accuracy === 0;
  const turnRight = shortestDelta(heading, qibla) > 0;

  useEffect(() => {
    let loop;
    if (aligned) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      pulseAnim.setValue(0);
    }
    return () => loop && loop.stop();
  }, [aligned]);

  function smoothAngle(prev, next, factor = 0.15) {
    const delta = shortestDelta(prev, next);
    return (prev + delta * factor + 360) % 360;
  }

  function calculateQibla(lat, lon) {
    const kaabaLat = deg2rad(KAABA.latitude);
    const kaabaLon = deg2rad(KAABA.longitude);

    const userLat = deg2rad(lat);
    const userLon = deg2rad(lon);

    const y = Math.sin(kaabaLon - userLon);

    const x =
      Math.cos(userLat) * Math.tan(kaabaLat) -
      Math.sin(userLat) * Math.cos(kaabaLon - userLon);

    const bearing = Math.atan2(y, x);

    return (rad2deg(bearing) + 360) % 360;
  }

  function deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  function rad2deg(rad) {
    return (rad * 180) / Math.PI;
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  const qiblaColor = aligned ? "#1FAE64" : "#E63946";

  // Precompute the Kaaba marker + dot-trail positions along the fixed
  // qibla bearing — plain trigonometry, no extra transforms involved.
  const dotRadii = [46, 70, 94, 118];
  const markerPoint = pointOnCircle(qibla, OUTER_RADIUS - 17, OUTER_SIZE);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qibla Compass</Text>
      <Text style={styles.subtitle}>Find the direction to the Kaaba</Text>

      {status !== "Ready" ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1FAE64" />
          <Text style={styles.loadingText}>{status}</Text>
        </View>
      ) : (
        <>
          <View style={styles.dialWrapper}>
            {/* fixed green ring — a plain color, so it makes no visual
                difference whether it "rotates" or not */}
            <View style={styles.outerRing} />

            {/* everything below rotates together as one physical plate */}
            <Animated.View
              style={[styles.dialRotor, { transform: [{ rotate }] }]}
            >
              <View style={styles.dialFace}>
                <View style={styles.mapCircle}>
                  {[0, 45, 90, 135].map((deg) => (
                    <View
                      key={deg}
                      style={[styles.mapLine, { transform: [{ rotate: `${deg}deg` }] }]}
                    />
                  ))}
                </View>

                {Array.from({ length: 60 }).map((_, i) => {
                  const deg = i * 6;
                  const isMajor = deg % 90 === 0;
                  return (
                    <View
                      key={deg}
                      style={[
                        styles.tickContainer,
                        { transform: [{ rotate: `${deg}deg` }] },
                      ]}
                    >
                      <View style={[styles.tick, isMajor && styles.tickMajor]} />
                    </View>
                  );
                })}

                {CARDINALS.map(({ label, angle }) => {
                  const { x, y } = pointOnCircle(angle, DIAL_RADIUS - 38, DIAL_SIZE);
                  return (
                    <Text
                      key={label}
                      style={[styles.cardinalLabel, { left: x - 16, top: y - 14 }]}
                    >
                      {label}
                    </Text>
                  );
                })}
              </View>

              {/* dot trail toward the Kaaba bearing — plain positions, no
                  extra rotation, so nothing here can develop a sign bug */}
              {dotRadii.map((radius, i) => {
                const { x, y } = pointOnCircle(qibla, radius, OUTER_SIZE);
                return (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { left: x - 2, top: y - 2, backgroundColor: qiblaColor },
                    ]}
                  />
                );
              })}

              {/* small arrow near center, pointing along the qibla bearing —
                  its rotation is a fixed constant (qibla), not animated, so
                  it can't accumulate a wraparound bug */}
              <View
                style={[
                  styles.arrowPivot,
                  { transform: [{ rotate: `${qibla}deg` }] },
                ]}
              >
                <View style={[styles.arrow, { borderBottomColor: qiblaColor }]} />
              </View>

              {/* Kaaba marker, fixed at the qibla bearing on the plate */}
              <View
                style={[
                  styles.kaabaMarker,
                  { left: markerPoint.x - 17, top: markerPoint.y - 17, borderColor: qiblaColor },
                ]}
              >
                <Text style={styles.kaabaIcon}>🕋</Text>
              </View>
            </Animated.View>

            {/* fixed center pivot, drawn above everything */}
            <View style={styles.centerHub} />

            {/* fixed reference notch — represents the direction you're
                currently facing; the Kaaba marker aligns under this */}
            <View style={styles.topPointer} />
          </View>

          {needsCalibration && (
            <View style={styles.calibrateBanner}>
              <Text style={styles.calibrateText}>
                ⚠️ Move your phone in a figure-8 to calibrate the compass
              </Text>
            </View>
          )}

          <View style={styles.readoutRow}>
            <View style={styles.readoutPill}>
              <Text style={styles.readoutLabel}>HEADING</Text>
              <Text style={styles.readoutValue}>{heading}°</Text>
            </View>
            <View style={styles.readoutPill}>
              <Text style={styles.readoutLabel}>QIBLA</Text>
              <Text style={styles.readoutValue}>{Math.round(qibla)}°</Text>
            </View>
            <View style={styles.readoutPill}>
              <Text style={styles.readoutLabel}>OFF BY</Text>
              <Text style={styles.readoutValue}>{Math.round(diff)}°</Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.statusBanner,
              aligned ? styles.statusBannerAligned : styles.statusBannerOff,
              aligned && {
                shadowOpacity: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.25, 0.6],
                }),
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                aligned ? styles.statusTextAligned : styles.statusTextOff,
              ]}
            >
              {aligned
                ? "✅  Facing Qibla"
                : `${turnRight ? "↻ Turn Right" : "↺ Turn Left"} ${Math.round(
                    diff
                  )}°`}
            </Text>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#16213B",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 28,
  },

  loadingBox: {
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    color: "#4B5563",
    fontSize: 14,
  },

  dialWrapper: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  outerRing: {
    position: "absolute",
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_RADIUS,
    backgroundColor: "#1FAE64",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  dialRotor: {
    position: "absolute",
    top: 0,
    left: 0,
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  dialFace: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_RADIUS,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  mapCircle: {
    position: "absolute",
    top: DIAL_SIZE * 0.19,
    left: DIAL_SIZE * 0.19,
    width: DIAL_SIZE * 0.62,
    height: DIAL_SIZE * 0.62,
    borderRadius: (DIAL_SIZE * 0.62) / 2,
    backgroundColor: "#DCEEE0",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  mapLine: {
    position: "absolute",
    width: "150%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  tickContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: "center",
  },

  tick: {
    width: 2,
    height: 8,
    marginTop: 8,
    borderRadius: 1,
    backgroundColor: "#16213B",
    opacity: 0.35,
  },

  tickMajor: {
    width: 3,
    height: 16,
    opacity: 1,
  },

  cardinalLabel: {
    position: "absolute",
    width: 32,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#16213B",
  },

  dot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  arrowPivot: {
    position: "absolute",
    top: OUTER_RADIUS - 20,
    left: OUTER_RADIUS - 10,
    width: 20,
    height: 40,
    alignItems: "center",
    zIndex: 999
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 24,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  kaabaMarker: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  kaabaIcon: {
    fontSize: 18,
  },

  centerHub: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#16213B",
    borderWidth: 3,
    borderColor: "#FFFFFF", 
  },

  topPointer: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#16213B",
  },

  calibrateBanner: {
    backgroundColor: "rgba(230,57,70,0.08)",
    borderWidth: 1,
    borderColor: "rgba(230,57,70,0.35)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  calibrateText: {
    color: "#B8232F",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  readoutRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  readoutPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E9E7",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 88,
  },

  readoutLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#8A9089",
    marginBottom: 4,
  },

  readoutValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#16213B",
  },

  statusBanner: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 4,
  },

  statusBannerAligned: {
    borderColor: "#1FAE64",
    shadowColor: "#1FAE64",
  },

  statusBannerOff: {
    borderColor: "#E5E9E7",
    shadowOpacity: 0,
  },

  statusText: {
    fontSize: 16,
    fontWeight: "700",
  },

  statusTextAligned: {
    color: "#1FAE64",
  },

  statusTextOff: {
    color: "#16213B",
  },
});