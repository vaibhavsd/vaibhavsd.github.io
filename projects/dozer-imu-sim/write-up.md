An interactive track-type tractor (dozer) grade-control demo — IMU/GNSS state estimation feeding closed-loop blade automation, in the style of the heavy-equipment machine control systems I've worked on.

## 1. Project idea

Grade-control systems on dozers hold a blade's cutting edge to a target elevation automatically, so the operator just drives and the machine does the fine vertical work. Doing that needs two things working together: an **estimator** that knows where the cutting edge actually is despite noisy, biased sensors, and a **controller** that moves the blade lift cylinders to close the gap.

This demo builds both, end to end, for a track-type tractor: two body-mounted IMUs (chassis pitch, push-arm pitch) plus a GNSS-aided vertical-rate channel for cutting-edge elevation, run through machine forward kinematics to locate the blade, then closed under automation.

## 2. State estimation

Each channel — body pitch, push-arm pitch, and cutting-edge elevation — runs its own 2-state Kalman filter estimating the quantity **and** the sensor's slowly-drifting bias:

$$x=\begin{bmatrix}\theta\\ b\end{bmatrix},\qquad \dot\theta = u - b$$

where $u$ is the rate input (gyro for the pitch channels, GNSS-derived vertical rate for elevation) and $b$ is the bias the filter co-estimates. Each cycle:

- **Predict** — integrate the bias-corrected rate: $\hat\theta \mathrel{+}= (u-\hat b)\,\Delta t$, and propagate covariance with small process noise on angle and an even smaller random-walk noise on bias.
- **Update** — correct against a second, noisier absolute measurement (an inclinometer-style accel-derived angle for pitch, a GNSS-derived position for elevation), with the Kalman gain weighting rate-integration against absolute measurement by their relative noise.

Rate sensors alone drift; absolute sensors alone are noisy and can be intermittent. Fusing them lets the filter track the true angle closely while continuously re-estimating the gyro bias it can't observe directly — you can watch the estimated bias converge toward the (normally hidden) true bias in the demo's readouts.

Body pitch and push-arm pitch then go through the machine's forward kinematics — known link geometry from the track roller line out to the blade cutting edge — to locate the cutting edge in the world, which the elevation channel's own filter cross-checks independently.

## 3. Automation

With the cutting edge located, automation is a closed loop on the blade lift cylinders: estimated elevation error against the operator-set cut level drives lift rate, holding the edge on grade while the operator only drives forward/reverse. The demo also carries a simple cut-and-fill model — the blade accumulates a load as it cuts high ground and meters it back out over low ground — so a full automated pass visibly flattens the terrain toward the target grade.

The blade sits about 2.85 m ahead of the track centerline, so body pitch arrives at the cutting edge amplified roughly 1.6×, and the tracks pitch over every bump in the real ground the automation has to reject. Even against that amplified disturbance, the closed loop holds the edge to about 1 cm — the "watch demo" run in the embed below shows that disturbance rejection directly.

## 4. Demo

Click **Watch demo** for a scripted automated pass, or take over: **A/D** drives, **W/S** raises/lowers the blade manually, **G** toggles automation (once it's on, **W/S** instead moves the cut level), and the sliders adjust final grade and sensor noise live. Each telemetry card shows the live estimate against the (otherwise hidden) ground truth, plus the bias term the filter is tracking — watch it converge in the first few seconds.

<iframe class="demo-frame" src="./dozer-imu-sim.html" title="Track-Type Tractor Automation interactive demo" loading="lazy"></iframe>
<p class="demo-cap">Live demo — single self-contained HTML file, embedded directly, no build step.</p>

## 5. Summary

- Two-state (angle + bias) Kalman filters fusing rate integration with noisy absolute measurements — one per sensed quantity (chassis pitch, push-arm pitch, cutting-edge elevation).
- Machine forward kinematics turning fused link angles into a cutting-edge position, cross-checked against an independently-estimated elevation channel.
- A closed-loop automation controller driving blade lift cylinders off that estimate to hold grade, with a cut-and-fill terrain model so a pass visibly does real earthmoving.
- Built independently as a personal demo of the kind of IMU-based state estimation and grade-control automation used in heavy-equipment machine control — original code, no proprietary logic from any employer.

**Download:** [dozer-imu-sim.html](./dozer-imu-sim.html) — the whole simulation, one self-contained file, no server or install needed.
