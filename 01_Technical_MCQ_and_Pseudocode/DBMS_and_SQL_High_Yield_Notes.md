# 🗄️ DBMS & SQL High-Yield Revision Notes

Crucial for **Capgemini Round 1 (Technical MCQs)** and **Round 3 (Technical Interview)**.

---

## ⚡ 1. ACID Properties (Always Asked)

1. **Atomicity:** All operations in a transaction succeed, or none do ("All or Nothing"). Managed by the *Transaction Manager* / Undo logs.
2. **Consistency:** Database must transition from one valid state to another valid state, preserving all integrity constraints.
3. **Isolation:** Concurrent transactions execute without interfering with one another. Managed by *Concurrency Control* (locks/timestamps).
4. **Durability:** Once a transaction commits, its changes are permanent even in the event of a system crash. Managed by *Redo logs / Write-Ahead Logging (WAL)*.

---

## 🔑 2. Keys in Relational Databases

- **Super Key:** A set of one or more attributes that uniquely identifies a row in a table.
- **Candidate Key:** A minimal Super Key with no redundant attributes.
- **Primary Key:** The chosen Candidate Key. Must be **UNIQUE** and **NOT NULL**. (Only one PK per table).
- **Alternate Key:** Candidate keys that were not chosen as the Primary Key.
- **Foreign Key:** An attribute that references the Primary Key of another table, ensuring *Referential Integrity*.
- **Composite Key:** A key composed of two or more columns to achieve uniqueness.

---

## 📏 3. Normalization (Eliminating Anomalies)

| Normal Form | Rule to Satisfy |
| :--- | :--- |
| **1NF** | Atomic values only (no repeating groups, arrays, or comma-separated lists in a single cell). |
| **2NF** | In 1NF + **No Partial Dependency** (Every non-prime attribute must depend on the *entire* candidate key, not just a part of a composite key). |
| **3NF** | In 2NF + **No Transitive Dependency** ($X \rightarrow Y$ and $Y \rightarrow Z \implies X \rightarrow Z$ where neither is a candidate key). |
| **BCNF** | Stricter 3NF: For every functional dependency $X \rightarrow Y$, **$X$ MUST be a Super Key**. |

---

## 🔗 4. SQL JOINs Explained

```
           Table A                    Table B
        +-----------+              +-----------+
        |     A     |   INNER      |     B     |
        |       [   |   JOIN   ]   |           |
        +-----------+              +-----------+
```
- **INNER JOIN:** Returns records with matching values in both tables.
- **LEFT (OUTER) JOIN:** Returns all records from Table A, and matched records from Table B (NULL if no match).
- **RIGHT (OUTER) JOIN:** Returns all records from Table B, and matched records from Table A.
- **FULL (OUTER) JOIN:** Returns records when there is a match in either left or right table.
- **CROSS JOIN:** Cartesian product ($M \times N$ rows).

---

## 💻 5. Top 5 Most Repeated SQL Queries in Capgemini

### Query 1: Find the 2nd Highest Salary
**Approach 1 (Subquery - Universal):**
```sql
SELECT MAX(salary) 
FROM Employee 
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

**Approach 2 (LIMIT / OFFSET in MySQL):**
```sql
SELECT DISTINCT salary 
FROM Employee 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;
```

**Approach 3 (Window Function - Nth Highest Salary):**
```sql
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num
    FROM Employee
)
SELECT DISTINCT salary 
FROM RankedSalaries 
WHERE rank_num = 2; -- Change '2' to 'N' for Nth highest
```

---

### Query 2: Find Duplicate Records in a Table
```sql
SELECT email, COUNT(*) 
FROM Users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

---

### Query 3: Delete Duplicate Rows Keeping Only One (Unique ID)
```sql
DELETE FROM Users 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM Users 
    GROUP BY email
);
```

---

### Query 4: Department-wise Highest Salary
```sql
SELECT department_id, MAX(salary) 
FROM Employee 
GROUP BY department_id;
```

---

### Query 5: Employees Earning More Than Their Managers (Self Join)
```sql
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

---

## ⚡ 6. Clustered vs Non-Clustered Index

| Feature | Clustered Index | Non-Clustered Index |
| :--- | :--- | :--- |
| **Physical Order** | Alters the physical order of data rows on disk | Does not alter physical order; creates a separate pointer structure (B-Tree) |
| **Count** | Exactly **ONE** per table (usually Primary Key) | Multiple per table (typically up to 999) |
| **Lookup Speed** | Extremely fast (reads leaf node directly) | Requires an extra pointer lookup (bookmark lookup) |
