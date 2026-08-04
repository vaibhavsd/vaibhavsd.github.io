A Simulink model with PID control for a second order system (Train Model). Implementing production ready PID. 


## Process

Designing a PID that has
- Integral term to have zero steady state error
- Saturation block to avoid controller output becoming too high/low
- Low pass filter on the derivative term
- Fix for avoiding derivative kick
- Integral term saturation reset logic
- Rate limiter on input to avoid reference changing immediately


## Result


![Simulink block diagram comparing PD and PID control of a train position model](./TrainModel.jpg)

![PID Result](./Plot.jpg)


**Download the model:** [TrainModel.slx](./TrainModel.slx)
