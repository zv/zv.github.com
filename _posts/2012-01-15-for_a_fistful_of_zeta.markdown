---
layout: post
title: For a Fistful of Zetas
category: note
excerpt: Or how Statistical Regression Got its Groove Back
---
<div class=txt>

<p>An interesting derivation in mathematics that demonstrations, amongst other things, the fundamental ubiquity of \(\pi\), is the probability that two random integers are relatively prime is \(\frac{1}{\zeta(2)}\), where</center></ br> $$\displaystyle \zeta(s) = \sum_{n \ge 1} \frac{1}{n^s}$$ is the <a href="http://en.wikipedia.org/wiki/Riemann_zeta_function">Riemann zeta function</a>. Last week, during a conversation with my (ostensible) boss <a href="https://twitter.com/scottamilliken">Scott Milliken</a> and Sam the Man over some fine vietnamese sandwiches, this question came up, "If you're standing at the center of an infinite network sending a packet with an infinite <a href="http://en.wikipedia.org/wiki/Time_to_live">TTL</a> with routers in this network beinglattice points all around you, with some relative cardinality of direction (N, S, E, W). For the sake of conversation, the routing paths have only knowledge of their directly connected peers, so to send a message, you must guess perfectly.

First of all, what do we mean by a “random” integer? It’s not hard to see that there is no uniform probability distribution on the positive integers. The strongest statement that is meant when one says that a positive integer has a probability, lets say \(P\), of being in some subset \(S \subseteq \mathbb{N}\) is the <a href="http://en.wikipedia.org/wiki/Natural_density">natural density function</a>. 

$$\displaystyle \lim_{n \to \infty} \frac{ | \{ 1, 2, ... n \} \cap S |}{n}$$

is equal to p.  From this, it is self evident the probability that a natural number is divisible by \(k\) is \(\frac{1}{k}\). Natural density is by no means a perfect measure - It isn't defined for all subsets of \(\mathbb{N}\) and, as such, it does not serve us as a probability measure in theoretical applications. In particular, its not countably additive across its group, since each positive integer has some scalar measure of at least the degree 0.</p>



<p>If we want an rigorous measure on \(\mathbb{N}\), we need to choose an arbitrary selection of natural numbers \(a_n, n \in \mathbb{N}\) such that \(\sum a_n = 1\).  Since we’re trying to answer the question of relatively prime integers, we should pick the \(a_n\) to have nice NT properties.  One property that’s natural to ask for, as above, is that the probability that an integer is divisible by \(p\) should be \(\frac{1}{p}\) for any positive integer \(p\).  In other words, we want</p>

<p align="center">\(\displaystyle \sum_{k=1}^{\infty} a_{pk} = \frac{1}{p}\)</p>
<p>for all \(p \ge 1\).  The implication stands that the events that an integer is divisible by one of two relatively prime ints are independent.  </p>

<p>Tragically, this is impossible.  For any positive integer, it’s clear that \(a_n\) is at most the probability that a positive integer is not divisible by \(p\) for any prime \(p \nmid n\).  The probability that a positive integer is not backappied by \(p\) is \(1 - \frac{1}{p}\), and since these are independent, the probability that a positive integer is not divisible by the primes not dividing \(n\) is</p>
<p align="center">\(\displaystyle \prod_{p \nmid n} \left( 1 - \frac{1}{p} \right)\)</p>
<p>which diverges to zero, so \(a_n = 0\); contradiction.  </p>


</div>
