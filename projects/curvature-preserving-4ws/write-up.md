Adapting an existing front-wheel-only (2WS) steering controller to a 4-wheel-steer (4WS) vehicle without redesigning it.

## 1. Project idea

Start with a path-tracking / steering controller that was designed and tuned assuming a normal front-wheel-only (2WS) vehicle: given a desired path, it outputs a single front steering angle, $\delta_{cmd}$, sized to produce the curvature needed to track that path.

Now put that same controller on a vehicle that also has rear-wheel steering (4WS). The rear wheels steer on their own, following a speed-dependent policy relative to whatever front angle is actually applied — turning opposite the front at low speed, and the same direction as the front at high speed. If the controller keeps sending its original front angle unmodified, the rear wheels add a curvature contribution the controller never accounted for, and the vehicle drifts off the intended path.

**Goal:** correct the front angle, in real time, so that once the rear wheels respond, the *combined* front+rear curvature exactly reproduces the path the original 2WS controller intended — reusing the existing controller as-is, while still getting the natural benefits of 4WS (tighter low-speed turns, smoother high-speed response).

## 2. The math

Model the vehicle as a single-track ("bicycle") model with wheelbase $L$. For a front-only (2WS) vehicle, path curvature is:

$$\kappa_{ref} = \frac{\tan(\delta_{cmd})}{L} \quad \text{— curvature the 2WS controller intended}$$

For the 4WS vehicle, both wheel pairs contribute:

$$\kappa = \frac{\tan(\delta_f) - \tan(\delta_r)}{L}$$

The rear wheels steer automatically as a function of speed and whatever front angle is applied: $\delta_r = k(v) \cdot \delta_f$, where $k(v)$ is negative at low speed (opposite direction) and small and positive at high speed (same direction). Sending $\delta_{cmd}$ straight through gives an **uncorrected** curvature of $(\tan \delta_{cmd} - \tan(k(v) \cdot \delta_{cmd})) / L$ — not $\kappa_{ref}$.

To preserve the original path, solve for the front angle $\delta_f$ that, once the rear responds, reproduces $\kappa_{ref}$ exactly:

$$\tan(\delta_f) - \tan(k(v) \cdot \delta_f) = \tan(\delta_{cmd})$$

solved numerically (bisection) for $\delta_f$ at every control cycle, then:

$$\delta_r = k(v) \cdot \delta_f$$

Command $\delta_f$ to the front wheels; the rear settles to $\delta_r$ on its own; the resulting path matches what the original 2WS controller intended — while the correction itself routes part of the turn through the rear wheels, which is what naturally produces the tighter low-speed radius / smoother high-speed response 4WS is known for.

## 3. Demo

Drag the controller's intended front angle and vehicle speed and watch three paths update live, all starting from the same point and heading:

- **Intended path (2WS reference)** — dashed gray — what a pure 2WS vehicle would trace with the controller's front angle.
- **Uncorrected** — dotted red — what actually happens if that same front angle is sent straight to the 4WS vehicle, whose rear wheels silently add their own curvature.
- **Corrected (curvature-preserving)** — solid teal — the front angle after applying the correction above; it tracks the reference almost exactly.

A small moving marker animates along each path so you can see the corrected vehicle staying with the reference while the uncorrected one visibly drifts.

<iframe class="demo-frame" src="./4ws-vehicle-dynamics-demo.html" title="Curvature-Preserving 4WS interactive demo" loading="lazy"></iframe>
<p class="demo-cap">Live demo — single self-contained HTML file, embedded directly, no build step.</p>

## 4. Summary

- Reused an unmodified 2WS path-tracking controller on a 4WS vehicle — no controller redesign needed.
- Sending the controller's front angle straight through (uncorrected) lets the rear wheels' independent response silently change the path curvature — the demo's "path error" readout quantifies exactly how far off, for whatever speed/angle you pick.
- Solving the curvature-preserving equation for the front angle brings the path error back to ~0% at every speed and angle tested — the corrected path overlays the intended one almost exactly.
- As a side effect, the correction naturally reproduces classic 4WS behavior: a noticeably tighter turn radius at low speed, and a gentler, more stable response at highway speed, for the same driver/controller intent.
- The root-finding step (1-D bisection) is cheap enough to run every control cycle in real time.

**Download:** [4ws-vehicle-dynamics-demo.html](./4ws-vehicle-dynamics-demo.html) — the whole simulation, one self-contained file, no server or install needed.
