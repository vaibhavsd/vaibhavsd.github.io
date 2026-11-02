An interactive ADAS lane-centering lab — Pure Pursuit, LQR and MPC steering controllers running head-to-head on a dynamic bicycle model, driving a triangular circuit with three different corner radii.

## 1. Project idea

Lane centering looks easy on a straight road and gets interesting in the corners. This lab puts one vehicle model on one track and lets you swap the controller underneath it, so you can see how each approach handles the same hairpin, medium corner and sweeper at the same speed — and what you give up when you push the speed up.

The track is a scalene triangle with rounded corners of three different radii: a **hairpin** (R 35 m), a **medium** corner (R 60 m) and a **sweeper** (R 110 m), joined by straights. Speed is adjustable from 5 to 30 m/s, so the same corner can be an easy drive or well into the understeer regime.

## 2. Vehicle model

The plant is a dynamic bicycle model with front/rear cornering stiffness, mass and yaw inertia, expressed in Frenet error coordinates relative to the lane centerline:

$$x=\begin{bmatrix}e\\ \dot e\\ \psi_e\\ \dot\psi_e\end{bmatrix}$$

lateral error, its rate, heading error and its rate. Steering is limited to ±0.55 rad and rate-limited to 7 rad/s, so an aggressive controller really does saturate. Road curvature enters as a disturbance, which is why a purely feedback controller lags in a corner and why feedforward matters.

## 3. Controllers

- **Perfect Driver** — a high-gain LQR with exact curvature feedforward, used as the reference to compare the others against.
- **Pure Pursuit** — a geometric controller that aims at a look-ahead point on the path, with look-ahead distance scaling with speed (clamped between a minimum and maximum).
- **LQR** — the feedback gains come from iterating the discrete Riccati equation live in the browser on the speed-dependent linear model, with tunable cost weights on each state and on steering effort. Optional curvature feedforward adds the steady-state steering and heading offset needed to hold a constant-radius turn.
- **MPC** — a condensed receding-horizon quadratic program solved at 20 Hz, with curvature **preview** along the upcoming path, a steering-rate penalty and a terminal cost, solved with a Cholesky factorisation. Previewing the corner lets it start steering before the feedback error appears.

Each controller exposes its own tunables, and **Tune for me** restores a known-good set.

## 4. Demo

Pick a controller, change the speed, and watch the lateral error trace in the strip chart below the view while the telemetry panel reports lateral error, heading error, steering angle, curvature, lateral acceleration, lap time and rolling RMS / peak error over the last 10 s. **Nudge** kicks the car sideways, or grab it and drag it off the centerline to test recovery; if it leaves the lane by more than 5 m it respawns. Switch between the top view and a chase camera.

<iframe class="demo-frame" src="./adas-triangle-sim.html" title="ADAS Controller Lab interactive demo" loading="lazy" style="height:820px"></iframe>
<p class="demo-cap">Live demo — single self-contained HTML file, embedded directly, no build step.</p>

## 5. Summary

- A dynamic bicycle plant in Frenet error coordinates, with steering and steering-rate limits, on a track with three different corner radii.
- Three controllers on the same plant — geometric (Pure Pursuit), optimal feedback (LQR, Riccati solved live) and preview-based optimisation (MPC, QP at 20 Hz) — plus a reference driver.
- Live tuning, disturbance injection and per-controller error statistics to compare tracking accuracy against steering effort.
- Built independently as a personal controls demo — original code, no proprietary logic from any employer.

**Download:** [adas-triangle-sim.html](./adas-triangle-sim.html) — the whole simulation, one self-contained file, no server or install needed.
