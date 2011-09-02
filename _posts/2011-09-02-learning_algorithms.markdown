---
layout: post
title: Learning Model Selection
category: note
excerpt: A trusty comparison of regression and classification algorithms
---
<div class=txt>

<p>I would use probability theory to start with, and then pick whichever algorithm best calculates what probability theory tells you to do.  So you have training data \(T\), and some new precursors \(X\), and an object to classify \(Y\), as well as your prior information \(I\).</p>

<p>Given some training data *T*, some predicates, *X*, and an object to classify *Y* as well as your prior information *I*, As probability theory goes, just calculate it's probability, conditional on the information available to you:</p>

$$P(Y|T,X,I)$$

<p>Now we can use any of the rules of probability theory to manipulate this into things that we do know how to calculate.  So using Bayes theorem, you get:</p>

$$P(Y|T,X,I)=\frac{P(Y|T,I)P(X|Y,T,I)}{P(X|T,I)}$$

<p>Deriving \(P(Y|T,I)\) is generally trivial - unless you prior information can tell you something about \(Y\) beyond the training data (e.g. correlations), then it is given by the rule of succession - or basically the observed fraction of times \(Y\) was true in the training data set.</p>

<p>For the second term \(P(X|Y,T,I)\) - this is your model, and where most of your work will go, and where different algorithms will do different things.  \(P(X|T,I)\) is a bit of a vicious beast to calculate, so we do the following trick to avoid having to do this: take the odds of \(Y\) against \(\overline{Y}\) (i.e. not \(Y\)). And we get:</p>

$$O(Y|T,X,I)=\frac{P(Y|T,X,I)}{P(\overline{Y}|T,X,I)}=\frac{P(Y|T,I)}{P(\overline{Y}|T,I)}\frac{P(X|Y,T,I)}{P(X|\overline{Y},T,I)}$$

<p>Now you basically need a decision rule - when the odds/probability is above a certain threshold, you will classify \(Y\) as "true", otherwise you will classify it as "false".  Now nobody can really help you with this - it is a decision which depends on the consequences of making right and wrong decisions.  This is a subjective exercise, and only the proper context can answer this.  Of course the "subjectivity" will only matter if there is high uncertainty (i.e. you have a "crap" model/data which can't distinguish the two very well).</p>

<p>The second quantity - the model \(P(X|Y,T,I)\) is a "predictive" model.  Suppose the prior information indicates a single model which depends on parameter \(\theta_{Y}\).  Then the quantity is given by:</p>

$$P(X|Y,T,I)=\int P(X,\theta_{Y}|Y,T,I) d\theta = \int P(X|\theta_{Y},Y,T,I)P(\theta_{Y}|Y,T,I) d\theta_{Y}$$

<p>Now if your model is of the "iid" variety, then \(P(X|\theta_{Y},Y,T,I)=P(X|\theta_{Y},Y,I)\).  But if you have a dependent model, such as an autoregressive one, then \(T\) may still matter.  And \(P(\theta_{Y}|Y,T,I)\) is the posterior distribution for the parameters in the model - this is the part that the training data would determine.  And this is probably where most of the work will go.</p>

<p>But what if the model is not known with certainty?  well it just becomes another nuisance parameter to integrate out, just as was done for \(\theta_{Y}\).  Call the ith model \(M_i\) and its set of parameters \(\theta^{(i)}_{Y}\), and the equation becomes:</p>

$$P(X|Y,T,I)= \sum_{i}P(M_{i}|Y,T,I)\int P(X|\theta_{Y}^{(i)},M_{i},Y,T,I)P(\theta_{Y}^{(i)}|M_{i},Y,T,I) d\theta_{Y}^{(i)}$$
Where
$$P(M_{i}|Y,T,I)=P(M_{i}|Y,I)\int P(\theta_{Y}^{(i)}|M_{i},Y,I)P(T|\theta_{Y}^{(i)},M_{i},Y,I) d\theta_{Y}^{(i)}$$

<p>(NOTE: \(M_i\) is a proposition of the form "the ith model is the best in the set that is being considered". and no improper priors allowed if you are integrating over models - the infinities do not cancel out in this case, and you will be left with non-sense)</p>

<p>Now, up to this point, all results are exact and optimal (this is the option 2 - apply some awesome algorithm to the data).  But this a daunting task to undertake.  In the real world, the mathematics required may be not feasible to do in practice - so you will have to compromise.  you should always "have a go" at doing the exact equations, for any maths that you can simplify will save you time at the PC.  However, this first step is important, because this sets "the target", and it makes it clear what is to be done.  Otherwise you are left (as you seem to be) with a whole host of potential options with nothing to choose between them.</p>

<p>Now at this stage, we are still in "symbolic logic" world, where nothing really makes sense.  So you need to link these to your specific problem:</p>

 1. \(P(M_{i}|Y,I)\) is the prior probability for the ith model - generally will be equal for all i.
 2. \(P(\theta_{Y}^{(i)}|M_{i},Y,I)\) is the prior for the parameters in the ith model (must be proper!)
 3. \(P(T|\theta_{Y}^{(i)},M_{i},Y,I)\) is the likelihood function for the training data, given the ith model
 4. \(P(\theta_{Y}^{(i)}|T,M_{i},Y,I)\) is the posterior for the parameters in the ith model, conditional on the training data.
 5. \(P(M_{i}|Y,T,I)\) is the posterior for the ith model conditional on the training data

There will be another set of equations for \(\overline{Y}\)

<p>Note that the equations will simplify enormously if a) one model is a clear winner, so that \(P(M_{j}|Y,T,I)\approx 1\) and b) within this model, its parameters are very accurate, so the integrand resembles a delta function (and integration is very close to substitution or plug-in estimates).  If both these conditions are met you have:</p>

$$P(X|Y,T,I)\approx P(X|\theta_{Y}^{(j)},M_{j},Y,T,I)_{\theta_{Y}^{(j)}=\hat{\theta}_{Y}^{(j)}}$$

Which is the "standard" approach to this kind of problem.
</div>


