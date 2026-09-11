# 🧠 Capgemini Pseudocode: Master Rules, Shortcuts & Traps

The Pseudocode section is the **#1 reason candidates get eliminated** in Capgemini Round 1. Capgemini uses questions designed to trick you with operator precedence, bitwise logic, short-circuit evaluation, and recursive stack tracing.

---

## ⚡ 1. Bitwise Operators (The Most Repeated Capgemini Trap)

Capgemini tests bitwise operators in almost **50% of pseudocode questions**.

### Core Truth Table
| A | B | `A & B` (AND) | `A \| B` (OR) | `A ^ B` (XOR) |
|:-:|:-:|:-------------:|:-------------:|:-------------:|
| 0 | 0 |       0       |       0       |       0       |
| 0 | 1 |       0       |       1       |       1       |
| 1 | 0 |       0       |       1       |       1       |
| 1 | 1 |       1       |       1       |       0       |

### 🔑 Golden Bitwise Properties to Memorize
1. **XOR (`^`) Magic:**
   - `a ^ 0 = a`
   - `a ^ a = 0`
   - `a ^ b ^ a = b`
   - If two numbers are identical, their XOR is `0`.
   - XOR of consecutive numbers:
     - Even $n$: $n \oplus (n+1) = 1$ (e.g., $4 \oplus 5 = 1$, $12 \oplus 13 = 1$)
2. **Bitwise NOT (`~`):**
   - Formula: `~x = -(x + 1)`
   - Examples:
     - `~5 = -(5 + 1) = -6`
     - `~0 = -1`
     - `~(-7) = -(-7 + 1) = 6`
3. **Left Shift (`<<`) and Right Shift (`>>`):**
   - `a << b` = $a \times 2^b$ (e.g., `5 << 2` = $5 \times 4 = 20$)
   - `a >> b` = $\lfloor a / 2^b \rfloor$ (e.g., `20 >> 2` = $20 / 4 = 5$)
4. **Odd / Even Check:**
   - `(n & 1) == 1` $\rightarrow$ Odd
   - `(n & 1) == 0` $\rightarrow$ Even

---

## ⚠️ 2. Short-Circuit Evaluation Traps

In pseudocode expressions:
- In `A && B` (Logical AND):
  - If `A` evaluates to `FALSE` (or `0`), **`B` is NEVER executed**.
  - If `B` has side-effects (like `b++` or `b = b + 2`), **those side effects DO NOT OCCUR**.
- In `A || B` (Logical OR):
  - If `A` evaluates to `TRUE` (non-zero), **`B` is NEVER executed**.

### 💡 Trap Example:
```text
Integer a = 0, b = 5, c = 10
if (a && (++b > 5))
    c = c + 1
print b, c
```
- **Analysis:** `a` is `0` (False). Because of short-circuiting in `&&`, `(++b > 5)` is **skipped completely**!
- `b` remains `5`, `c` remains `10`.
- **Output:** `5, 10` (Many students mistakenly mark `6, 10` or `6, 11`).

---

## 🔄 3. Loop Execution & Off-By-One Traps

Pay strict attention to the keyword syntax:
1. `for each i from 1 to 5`:
   - In Capgemini pseudocode, loop bounds `1 to 5` are typically **INCLUSIVE** (executes for $i = 1, 2, 3, 4, 5$, total 5 times).
   - If written `1 to 5 step 2`: executes for $i = 1, 3, 5$ (total 3 times).
2. While loops modifying loop condition variables inside:
   - Always trace step-by-step using a **Variable State Table**.

---

## 🪵 4. Recursion Tracing Strategy

Never trace recursion in your head. Always draw a **Tree or Call Stack**.

### Recursive Template Types:
1. **Head Recursion (Work done after recursive call returns):**
   ```text
   function solve(n)
       if (n <= 0) return
       solve(n - 1)
       print n
   ```
   - Call stack winds up to `solve(0)`, then unrolls printing: `1, 2, 3... n`

2. **Tail Recursion (Work done before recursive call):**
   ```text
   function solve(n)
       if (n <= 0) return
       print n
       solve(n - 1)
   ```
   - Prints immediately during call: `n, n-1, ... 1`

3. **Multiple Recursive Calls (Branching Tree):**
   ```text
   function fun(n)
       if (n <= 1) return 1
       return fun(n - 1) + fun(n - 2)
   ```
   - Draw branches: For each node, split into left and right children.

---

## 🎯 5. Step-by-Step Problem Solving Routine for the Exam

When a pseudocode question appears:
1. **Identify the Data Types & Initial Values**: Watch out for 0 vs 1 based indexing and integer division (`7 / 2 = 3`, not `3.5`).
2. **Spot Bitwise vs Logical**:
   - `&` is Bitwise AND (evaluates bit by bit).
   - `&&` is Logical AND (boolean true/false, short-circuits).
   - `^` is XOR, **NOT** exponentiation (e.g. $2 \text{ \textasciicircum } 3$ is `1`, not `8`!).
3. **Keep Scratch Paper Ready**: Draw a simple table with columns for each variable (`a | b | c | condition | output`) and update line by line.
