---
layout: post
title: SHA3 Implemented in the RARVM 
category: work
excerpt: 
thumb: /images/sha3.png
---

<div class="txt">

<p>
It's old hat now but NIST has settled on Keccak as the upcoming SHA-3 Hash function standard.
<br>
In celebration of keccak's standardization, here's an implementation based on the specification implementation that takes some arbitrary number of bytes and a size variable (pascal style!) and produces a Keccak-256 hash (64 bytes).
<br>
You can build it by updating the rarvmtools git submodule and make
</p>
<p>RAR VM?<p>
Believe it or not, RAR files can contain bytecode for a simple x86-like virtual machine called the RarVM. This is designed to provide filters (preprocessors) to perform some reversible transformation on input data to increase redundancy, and thus improve compression.
<br>
For example, one filter (likely inspired by LZX, an earlier scheme with a similar feature) is called "Intel E8 preprocessing", which is designed to increase redundancy in x86 code.
<br>
WinRAR includes around a dozen standard filters that improve compression of several common inputs, but surprisingly also allows new filters to be defined at runtime by archives!
<br>
<br>

<a href="https://github.com/zv/SHA3ImplementedInsideofaRARfile">SHA3 Implemented inside of a RAR File</a>

</p>

</div>
