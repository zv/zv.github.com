---
layout: page
title: Single Stepping with PTrace 
category: note
excerpt: A look into the abyss 
---
<div class=txt>


<p>PTrace is integral to the operation of all processes that examine another's execution in POSIX compatible operating systems -- it's the building block of every modern debugger implementation. It's versatile and well tested, and although the elements are quite simple, it's the perennial process examination library. Many books have been written about ptrace internals, so do not confuse this this document with a more comprehensive treatment of the subject.</p>

<p>Before we dive in, consider the prerequisite knowledge involved in a debugger. First, you have to know what exactly the internals of a debugger do, secondly, you have to figure out how to attach yourself to an existing process, how to "step" through code and coalesce low-level assembly references to high level variable values and data structures. The issue is further complicated by the proliferation of debuggers which support scripting to change the examined proccess's image</p>

<p>So lets begin where it seems natural</p>

<h3>Stepping</h3>

<p>Stepping is the procedure in a debugger that allows you to move through the program a single instruction (be it assembly or high level) at a time. Ptrace traces assembly language that is executed by the machine (I am quite sure you have seen this manifest through ptrace-dependent debuggers have a tendency to get "stuck" on complex single operations like malloc() and then inexplicably become unstuck after stepping though a certain number of instructions, if you provided debugging symbols)</p>

<p>Consider this canonical ptrace example</p>

<p>
<pre style='color:#000000;background:#ffffff;'><span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>sys/ptrace.h</span><span style='color:#800000; '>></span>
<span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>sys/types.h</span><span style='color:#800000; '>></span>
<span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>sys/wait.h</span><span style='color:#800000; '>></span>
<span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>unistd.h</span><span style='color:#800000; '>></span>
<span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>linux/user.h</span><span style='color:#800000; '>></span><span style='color:#004a43; '>   </span>

<span style='color:#800000; font-weight:bold; '>int</span> <span style='color:#400000; '>main</span><span style='color:#808030; '>(</span><span style='color:#808030; '>)</span>
<span style='color:#800080; '>{</span>   pid_t child<span style='color:#800080; '>;</span>
    <span style='color:#800000; font-weight:bold; '>long</span> orig_eax<span style='color:#800080; '>;</span>
    child <span style='color:#808030; '>=</span> fork<span style='color:#808030; '>(</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
    <span style='color:#800000; font-weight:bold; '>if</span><span style='color:#808030; '>(</span>child <span style='color:#808030; '>=</span><span style='color:#808030; '>=</span> <span style='color:#008c00; '>0</span><span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>
        ptrace<span style='color:#808030; '>(</span>PTRACE_TRACEME<span style='color:#808030; '>,</span> <span style='color:#008c00; '>0</span><span style='color:#808030; '>,</span> <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>,</span> <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
        execl<span style='color:#808030; '>(</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>/bin/ls</span><span style='color:#800000; '>"</span><span style='color:#808030; '>,</span> <span style='color:#800000; '>"</span><span style='color:#0000e6; '>ls</span><span style='color:#800000; '>"</span><span style='color:#808030; '>,</span> <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
    <span style='color:#800080; '>}</span>
    <span style='color:#800000; font-weight:bold; '>else</span> <span style='color:#800080; '>{</span>
        wait<span style='color:#808030; '>(</span><span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
        orig_eax <span style='color:#808030; '>=</span> ptrace<span style='color:#808030; '>(</span>PTRACE_PEEKUSER<span style='color:#808030; '>,</span>
                          child<span style='color:#808030; '>,</span> <span style='color:#008c00; '>4</span> <span style='color:#808030; '>*</span> ORIG_EAX<span style='color:#808030; '>,</span>
                          <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
        <span style='color:#603000; '>printf</span><span style='color:#808030; '>(</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>The child made a </span><span style='color:#800000; '>"</span>
               <span style='color:#800000; '>"</span><span style='color:#0000e6; '>system call </span><span style='color:#0f69ff; '>%ld</span><span style='color:#0f69ff; '>\n</span><span style='color:#800000; '>"</span><span style='color:#808030; '>,</span> orig_eax<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
        ptrace<span style='color:#808030; '>(</span>PTRACE_CONT<span style='color:#808030; '>,</span> child<span style='color:#808030; '>,</span> <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>,</span> <span style='color:#7d0045; '>NULL</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
    <span style='color:#800080; '>}</span>
    <span style='color:#800000; font-weight:bold; '>return</span> <span style='color:#008c00; '>0</span><span style='color:#800080; '>;</span>
<span style='color:#800080; '>}</span>
</pre>
</p>

<p>This should be somewhat self explanatory -- when this program runs, a new fork is created and the words "The child made a system call 11" (syscall 11 is execve) appear.</p> 

<p>The signature for ptrace is as follows 
  <i>long ptrace(enum __ptrace_request request, pid_t pid, void *addr, void *data);</i>
</p>

<p>The first argument specifies the type of PTRACE request, the second the PID and the 3rd and forth are generic addr & data pointers if you'd like to manipulate memory.</p> 

<p>As you can see, the ptrace call here makes the PTRACE_TRACEME request, which indicates that the child process may ask the OS to trace it, from here, any signal (save the highest interrupt level, SIGKILL) will cause the program to stop and the parent process to be sent a message. All susequent instructions will cause a trap signal to be sent, allowing the parent to control it before the program actually begins execution.</p> 

<p>When a remote thread[1] is created via exec(), it will stop and send the trap signal. The parent will wait() for this to happen with the first call, and wait() will return once a signal is sent to it. The parent then invokes ptrace with <i>PTRACE_SINGLESTEP</i> request containing the child process PID, this indicates to ptrace that it should restart the execution of the process but wait and after it executes the next instruction. The loop will terminate when the signal that came out of the wait call wasn’t about the child stopping. During a normal run of the tracer, this will be the signal that tells the parent that the child process exited (WIFEXITED would return true on it).</p>

Let us now consider the case of a ptrace tracer that prints the number of instructions executed.
Note that icounter counts the amount of instructions executed by the child process. So our simple example actually does something useful – given a program name on the command line, it executes the program and reports the amount of CPU instructions it took to run from start to finish. Let’s see it in action.

<p>I compiled the following simple program and ran it under the tracer:</p>

<p>
<pre style='color:#000000;background:#ffffff;'><span style='color:#004a43; '>#</span><span style='color:#004a43; '>include </span><span style='color:#800000; '>&lt;</span><span style='color:#40015a; '>stdio.h</span><span style='color:#800000; '>></span>

<span style='color:#800000; font-weight:bold; '>int</span> <span style='color:#400000; '>main</span><span style='color:#808030; '>(</span><span style='color:#808030; '>)</span>
<span style='color:#800080; '>{</span>
    <span style='color:#603000; '>printf</span><span style='color:#808030; '>(</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>Hello, world!</span><span style='color:#0f69ff; '>\n</span><span style='color:#800000; '>"</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
    <span style='color:#800000; font-weight:bold; '>return</span> <span style='color:#008c00; '>0</span><span style='color:#800080; '>;</span>
<span style='color:#800080; '>}</span>
</pre>
</p>

<p>As a note on low-level functionality, you will have to compile this program with -static to prevent dynamic linking from occurring. The reason for this is that in linux, GCC links programs to the C runtime dynamically, which requires that a dynamic library loader looks and loads the required shared objects </p>

<p>
<pre style='color:#000000;background:#ffffff;'><span style='color:#004a43; '>section</span>    .text
    <span style='color:#004a43; '>global</span> _start
<span style='color:#e34adc; '>_start:</span>
    <span style='color:#800000; font-weight:bold; '>mov</span>    <span style='color:#000080; '>ebx</span><span style='color:#808030; '>,</span> <span style='color:#008c00; '>1</span>
    <span style='color:#800000; font-weight:bold; '>mov</span>    <span style='color:#000080; '>edx</span><span style='color:#808030; '>,</span> len
    <span style='color:#800000; font-weight:bold; '>mov</span>    <span style='color:#000080; '>ecx</span><span style='color:#808030; '>,</span> msg
    <span style='color:#696969; '>; when int 80 is called, eax contains the syscall number</span>
    <span style='color:#800000; font-weight:bold; '>mov</span>    <span style='color:#000080; '>eax</span><span style='color:#808030; '>,</span> <span style='color:#008c00; '>4</span>
    <span style='color:#800000; font-weight:bold; '>int</span>    <span style='color:#008000; '>0x80</span>
    <span style='color:#800000; font-weight:bold; '>mov</span>    <span style='color:#000080; '>eax</span><span style='color:#808030; '>,</span> <span style='color:#008c00; '>1</span>
    <span style='color:#800000; font-weight:bold; '>int</span>    <span style='color:#008000; '>0x80</span>

<span style='color:#004a43; '>section</span>   <span style='color:#004a43; '>.data</span>
msg <span style='color:#004a43; '>db</span>    <span style='color:#0000e6; '>'Ptrace 4 lyfe!'</span><span style='color:#808030; '>,</span> <span style='color:#008000; '>0xa</span>
len <span style='color:#004a43; '>equ</span>    $ <span style='color:#808030; '>-</span> msg
</pre>
</p>
<p>Count the instructions and....
ptrace doesn't let us down</p>

<h3>Attaching to a running process with PTRACE_ATTACH</h3>

<p>
PTrace can also attach to existing processes, the PTRACE_ATTACH request handles this quite nicely, application is trivial given the above.
</p> 


<p>[1] - <i>This terminology is not entirely accurate, and "true" linux system programmers will become angry with the term "remote process" to describe a child process</i>
</p>

</div>
