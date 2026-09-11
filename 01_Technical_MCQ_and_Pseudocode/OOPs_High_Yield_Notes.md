# 🧱 Object-Oriented Programming (OOPs) – High-Yield Revision Notes

This guide covers everything tested in **Capgemini Round 1 (MCQs)** and **Round 3 (Technical Interview)** regarding OOPs.

---

## 🏛️ The 4 Pillars of OOPs

### 1. Encapsulation
- **Definition:** Bundling data (variables) and methods (functions) together into a single unit (class), and restricting direct access to internal components.
- **Implementation:** Declare variables as `private` and provide public `getter` and `setter` methods.
- **Why?** Data hiding, security, validation before setting values.

### 2. Abstraction
- **Definition:** Displaying only essential features of an object to the user and hiding the background implementation details.
- **Implementation:**
  - **Abstract Classes:** Can have both abstract (without body) and concrete methods. Cannot be instantiated.
  - **Interfaces:** Pure abstraction (in Java/C++ pure virtual class). Only method signatures.
- **Real-World Analogy:** Driving a car. You press the accelerator; you don't need to know the inner workings of fuel injection or piston compression.

### 3. Inheritance
- **Definition:** Mechanism where one class acquires properties and behaviors of another class (Parent/Base $\rightarrow$ Child/Derived).
- **Types:**
  - **Single Inheritance:** A $\rightarrow$ B
  - **Multilevel Inheritance:** A $\rightarrow$ B $\rightarrow$ C
  - **Hierarchical Inheritance:** A $\rightarrow$ B and A $\rightarrow$ C
  - **Multiple Inheritance:** A, B $\rightarrow$ C (Supported in C++, NOT supported directly in Java with classes to prevent the **Diamond Problem**; solved via Interfaces).
- **Keyword:** `extends` (Java), `: public Base` (C++).

### 4. Polymorphism
- **Definition:** Ability of an entity (function, operator, object) to take multiple forms ("Poly" = many, "Morph" = forms).
- **Two Major Types:**

| Feature | Compile-Time Polymorphism (Static Binding) | Run-Time Polymorphism (Dynamic Binding) |
| :--- | :--- | :--- |
| **Mechanism** | Method Overloading, Operator Overloading | Method Overriding (Virtual Functions) |
| **When resolved?** | At compile time | At runtime using V-Table (Virtual Table) |
| **Execution Speed** | Faster | Slightly slower due to lookup overhead |
| **Rules** | Same method name, **different parameter list** (type, number, or order) | Same method name, **identical parameters & return type** in derived class |

---

## ⚠️ Frequently Asked MCQs & Interview Concepts

### 1. Constructor and Destructor Execution Order
- **When creating an object of a derived class:**
  1. Base class constructor executes first.
  2. Derived class constructor executes second.
- **When destroying an object:**
  1. Derived class destructor executes first.
  2. Base class destructor executes second (Reverse order).

### 2. Virtual Functions & `virtual` Destructor (C++ Trap)
- If a base class pointer points to a derived class object:
  - Without `virtual`, calling a method will execute the **Base** class version (Static dispatch).
  - With `virtual`, it calls the **Derived** class version (Dynamic dispatch via V-Table).
- **Why need a virtual destructor?**
  - If you delete a derived object through a base pointer, without a `virtual` destructor in the base class, the derived class destructor will NOT be called, causing a **memory leak**!

### 3. Abstract Class vs Interface

| Aspect | Abstract Class | Interface |
| :--- | :--- | :--- |
| **Methods** | Can have both concrete and abstract methods | Purely abstract methods (default/static allowed in modern Java) |
| **Variables** | Can have instance variables with any access modifier | `public static final` constants only |
| **Inheritance** | Single inheritance (`extends`) | Multiple inheritance (`implements`) |
| **Speed** | Faster | Slightly slower due to search overhead |

### 4. `this` & `super` Keywords
- `this`: Refers to the current instance of the class.
- `super`: Refers to the immediate parent class (to invoke parent constructor or overridden parent methods).

### 5. Shallow Copy vs Deep Copy
- **Shallow Copy:** Copies memory addresses/references. If the original object's nested field changes, the copy also changes.
- **Deep Copy:** Creates a completely independent clone of dynamically allocated memory/objects.
