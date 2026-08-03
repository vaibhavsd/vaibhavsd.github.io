Designing a Linear Matrix Inequality (LMI) based controller to stabilize and steer Markov chain models — from an optimization formulation to a practical, sub-optimal version demonstrated on real ground robots.

## The problem

For a large population of simple robots, controlling every individual trajectory doesn't scale. A more tractable approach is to control the *distribution* of the swarm across a set of discretized regions instead — modeling each robot's motion between regions as a Markov chain, and designing the transition probabilities (the policy every robot follows) so the population-level distribution converges to, and stays at, a desired target distribution.

The challenge is that a transition matrix has to satisfy hard structural constraints — rows must be non-negative and sum to one — while also being stable and driving the chain toward the desired equilibrium. That makes naive optimization approaches awkward, but the problem can be cast as a Linear Matrix Inequality (LMI), for which efficient convex solvers exist.

## Process

- Modeled the swarm's population distribution over discretized regions as a discrete-time Markov chain, with the desired swarm distribution as the target equilibrium.
- Formulated stability and convergence-to-equilibrium conditions as LMIs, solving for a transition probability matrix that both stabilizes the chain at the target distribution and satisfies the Markov chain constraints (non-negative, row-stochastic).
- Validated the controller in simulation, then derived a practical, sub-optimal implementation that a resource-constrained, palm-sized ground robot could run — approximating the full LMI solution with something cheap enough to compute onboard.
- Deployed the resulting policy on real robots and compared the resulting population distribution against the simulated prediction.

## Result

The mean-field controller drove the swarm's population distribution to the target equilibrium in both simulation and the physical robot experiment, validating that the sub-optimal onboard implementation preserved the convergence guarantees of the full LMI-based design.

<div class="yt-grid">
  <div class="yt-embed">
    <button type="button" class="yt-thumb" data-yt="sPKEEsyGtM0" aria-label="Play video: Mean Field Stabilization of Markov Chain Models in Simulation and Robot Experiment">
      <img src="https://img.youtube.com/vi/sPKEEsyGtM0/hqdefault.jpg" alt="Mean Field Stabilization of Markov Chain Models in Simulation and Robot Experiment" loading="lazy" />
      <span class="yt-play" aria-hidden="true"><span class="yt-play-icon"></span></span>
    </button>
    <p class="yt-cap">Mean Field Stabilization of Markov Chain Models in Simulation and Robot Experiment</p>
  </div>
</div>

**Paper:** [Practical sub-optimal implementation of the control algorithm on palm-sized ground robots](https://ieeexplore.ieee.org/document/8264117) — IEEE Xplore, Jan 2018.
