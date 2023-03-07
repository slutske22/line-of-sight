# Line of Sight

This project is a proof of concept for calculating whether or not there is line of sight between 2 points on the earth. While there are other tools to achieve this goal, this project aims to do so at lightning speed, while the origin and/or target are in motion.

## Considering Earth's curvature

At large distances, the curvature of the earth may interfere with an otherwise direct line of sight. The height offset of $d$, along the _arc_ $\overset{\huge\frown}{AB}$ is represented by $y_r$ in this diagram:

<p align="center">
<img src="./images/earth-diagram.png" />
</p>

The formula for this height $y_r$ as a function of the distance $d$ is:

$$

y_r = R \left( 1 - \dfrac{ \cos \left( \dfrac{\theta*{AB}}{2} \right) }{ \cos \left( \dfrac{\theta\_{AB}}{2} - \theta \right) } \right)


$$

Where $\theta = \frac{d}{R}$. Ths discussion that spawned this formula can be found [here](https://math.stackexchange.com/questions/4653429/height-of-circle-bulge-along-given-arc/4653616). In scenarios where earth's curvature is calculated, every pixel at a distance $d$ the line between two points includes the term $y_r(d)$.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
