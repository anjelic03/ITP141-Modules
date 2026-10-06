const slideConfigs = [
  {
    type: 'cover',
    moduleTitle: 'MODULE 01 · TOPIC 03',
    topicNum: '03',
    topicTag: 'T3',
    title: 'File Permissions & Ownership',
    subtitle: 'Understand how Linux controls access, ownership, and privilege through the file permission model.',
    graphicText: 'Who may <em>read</em>?<br>Who may <em>write</em>?<br>Who may <em>execute</em>?',
    miniObjectives: ['Permission bits', 'Ownership', 'Special modes', 'Security models']
  },

  {
    type: 'objectives',
    header: 'MODULE 01 · TOPIC 03',
    kicker: 'ITP 141 · M1 · T3',
    desc: 'This topic covers the Linux permission model: user, group, and other access, ownership, and special modes.',
    lede: 'File permissions are the first line of defense in Linux security. If you do not understand them, you cannot safely administer a system.',
    list: [
      'Explain the meaning of read, write, and execute permissions.',
      'Differentiate owner, group, and other access.',
      'Use chmod, chown, and chgrp to manage permissions and ownership.',
      'Recognize the role of the setuid, setgid, and sticky bits.',
      'Apply the permission model in real administration scenarios.'
    ]
  },

  // 3. HISTORY OF AWK
    { type: 'lesson', category: 'History', title: 'awk: Origin', subtitle: 'The Beginning', desc: 'In 1977, Alfred Aho, Peter Weinberger, and Brian Kernighan created <code>awk</code> at Bell Labs. The name is derived from their last initials. It was designed to process structured data and generate reports.', syntax: 'awk "pattern {action}" file', term: [{raw:'<span class="out"># Aho, Weinberger, Kernighan</span><br>awk<br><span class="out"># A complete programming language for text processing.</span>'}], explain: '<strong>Why it matters:</strong> Unlike grep (which searches) and sed (which edits), awk is a full programming language. It automatically splits lines into fields (columns) and can perform math, making it the standard tool for generating reports from logs.' },
    
    // 4. ENVIRONMENT SETUP (The Master Setup Script)
    { type: 'lesson', category: 'Setup', title: 'Lab Environment Setup', subtitle: 'Generate Temp Files', desc: 'To avoid conflicts with previous labs, we will use <code>/tmp/itp141_awk</code>. Copy and run this script in your terminal to create the employee data we will use.', syntax: 'mkdir -p /tmp/itp141_awk && cd /tmp/itp141_awk', term: [{raw:'<span class="cmd">mkdir -p /tmp/itp141_awk && cd /tmp/itp141_awk</span><br><span class="cmd">echo "101:John Doe:Sales:45000" &gt; employees.txt</span><br><span class="cmd">echo "102:Jane Smith:Engineering:85000" &gt;&gt; employees.txt</span><br><span class="cmd">echo "103:Sam Brown:Sales:40000" &gt;&gt; employees.txt</span><br><span class="cmd">echo "104:Mary Johnson:Engineering:95000" &gt;&gt; employees.txt</span><br><span class="cmd">echo "105:James Lee:HR:50000" &gt;&gt; employees.txt</span><br><span class="cmd">echo "104 Mary Johnson 95" &gt; users.txt</span><br><span class="cmd">echo "102 Jane Smith 85" &gt;&gt; users.txt</span><br><span class="out">Setup complete!</span>'}], explain: '<strong>Explanation:</strong> This creates a safe, isolated lab directory in <code>/tmp/itp141_awk</code>. We populate <code>employees.txt</code> (colon-separated) and <code>users.txt</code> (space-separated). All future examples and labs use these files.' },

    // 5. AWK BASIC PRINT
    { type: 'lesson', category: 'awk Basics', title: 'awk: Print Columns', subtitle: 'Simple Extract', desc: 'The most basic use of awk. It automatically splits lines by whitespace and prints the specified column (field).', syntax: "awk '{print $1}' file", term: [{p:'/tmp/itp141_awk', c:"awk '{print $1}' users.txt"}, {o:'104'}, {o:'102'}], explain: '<strong>Explanation:</strong> awk reads <code>users.txt</code> line by line. It splits the line into fields. <code>$1</code> represents the first field. It prints the first column (the ID numbers) to the terminal.' },
    
    // 6. AWK FIELD SEPARATOR
    { type: 'lesson', category: 'awk Basics', title: 'awk: Field Separator', subtitle: 'awk -F', desc: 'By default, awk splits fields by whitespace. Use the <code>-F</code> flag to specify a different delimiter, like a colon.', syntax: "awk -F: '{print $2}' file", flags: [{f:'-F', s:'Field separator', d:'Defines the character that splits columns.'}], term: [{p:'/tmp/itp141_awk', c:"awk -F: '{print $2}' employees.txt"}, {o:'John Doe'}, {o:'Jane Smith'}, {o:'Sam Brown'}], explain: '<strong>Explanation:</strong> The <code>-F:</code> flag tells awk to split lines using a colon instead of whitespace. <code>$2</code> then refers to the second column (the names), which it extracts perfectly.' },

    // 7. AWK MULTIPLE FIELDS
    { type: 'lesson', category: 'awk Basics', title: 'awk: Multiple Fields', subtitle: 'Custom Output', desc: 'You can print multiple fields and add custom text in the print statement.', syntax: "awk -F: '{print \"Name: \" $2 \" - Dept: \" $3}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{print \"Name: \" $2 \", Dept: \" $3}' employees.txt"}, {o:'Name: John Doe, Dept: Sales'}, {o:'Name: Jane Smith, Dept: Engineering'}], explain: '<strong>Explanation:</strong> You can combine text and variables. <code>$2</code> is the name, <code>$3</code> is the department. awk concatenates them with your custom strings to create a readable report.' },

    // 8. AWK PATTERN MATCHING
    { type: 'lesson', category: 'awk Intermediate', title: 'awk: Pattern Matching', subtitle: 'Filter Rows', desc: 'awk can act like grep. If you specify a pattern before the braces, the action only runs on lines matching that pattern.', syntax: "awk -F: '/Engineering/ {print $2}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '/Engineering/ {print $2}' employees.txt"}, {o:'Jane Smith'}, {o:'Mary Johnson'}], explain: '<strong>Explanation:</strong> The pattern <code>/Engineering/</code> filters the lines. The action <code>{print $2}</code> only runs on those matching lines. It extracts the names of the Engineering staff.' },

    // 9. AWK NR AND NF
    { type: 'lesson', category: 'awk Intermediate', title: 'awk: Built-in Variables', subtitle: 'NR & NF', desc: 'awk has built-in variables. <code>NR</code> is the Number of Records (line number). <code>NF</code> is the Number of Fields (columns in the current line).', syntax: "awk '{print NR, NF}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{print \"Line \" NR \" has \" NF \" columns\"}' employees.txt"}, {o:'Line 1 has 4 columns'}, {o:'Line 2 has 4 columns'}], explain: '<strong>Explanation:</strong> <code>NR</code> tracks the current line number (1, 2, 3...). <code>NF</code> counts the columns in that line. This is highly useful for auditing data files for missing fields.' },

    // 10. AWK MATH
    { type: 'lesson', category: 'awk Intermediate', title: 'awk: Arithmetic', subtitle: 'Summing Columns', desc: 'awk can perform math on columns. You can sum up a column of numbers and print the total.', syntax: "awk -F: '{sum += $4} END {print sum}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{sum += $4} END {print \"Total Payroll: \" sum}' employees.txt"}, {o:'Total Payroll: 315000'}], explain: '<strong>Explanation:</strong> <code>sum += $4</code> adds the 4th column (salary) to a running total for every line. The <code>END</code> block runs after all lines are processed, printing the final total.' },

    // 11. EXACT FIELD MATCH
    { type: 'lesson', category: 'awk Intermediate', title: 'awk: Exact Field Match', subtitle: '$N == "value"', desc: 'Instead of regex pattern matching, you can check if a specific field exactly matches a string using <code>==</code>.', syntax: "awk -F: '$3 == \"Sales\" {print $0}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '$3 == \"Sales\" {print $0}' employees.txt"}, {o:'101:John Doe:Sales:45000'}, {o:'103:Sam Brown:Sales:40000'}], explain: '<strong>Explanation:</strong> <code>$3 == "Sales"</code> checks if the 3rd column exactly equals "Sales". <code>$0</code> prints the entire line. This is more precise than <code>/Sales/</code>, which would match "Sales" anywhere on the line.' },

    // 12. CONDITIONAL LOGIC
    { type: 'lesson', category: 'awk Intermediate', title: 'awk: Conditional Logic', subtitle: 'if/else', desc: 'awk supports standard <code>if/else</code> statements inside the action blocks to make decisions based on field values.', syntax: "awk -F: '{if ($4 > 50000) print $2 \" (High)\"; else print $2 \" (Low)\"}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{if ($4 > 50000) print $2 \" (High)\"; else print $2 \" (Low)\"}' employees.txt"}, {o:'John Doe (Low)'}, {o:'Jane Smith (High)'}, {o:'Sam Brown (Low)'}, {o:'Mary Johnson (High)'}, {o:'James Lee (Low)'}], explain: '<strong>Explanation:</strong> The <code>if ($4 > 50000)</code> evaluates the 4th column (salary). If true, it appends "(High)" to the name. If false, it appends "(Low)". This allows dynamic categorization of data.' },

    // 13. FORMATTED OUTPUT
    { type: 'lesson', category: 'awk Advanced', title: 'awk: Formatted Output', subtitle: 'printf', desc: 'Use <code>printf</code> instead of <code>print</code> to format output into aligned, readable tables with exact spacing.', syntax: "awk -F: 'BEGIN {printf \"%-10s %-15s %s\\n\", \"ID\", \"Name\", \"Dept\"} {printf \"%-10s %-15s %s\\n\", $1, $2, $3}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: 'BEGIN {printf \"%-10s %-15s %s\\n\", \"ID\", \"Name\", \"Dept\"} {printf \"%-10s %-15s %s\\n\", $1, $2, $3}' employees.txt"}, {o:'ID         Name            Dept'}, {o:'101        John Doe        Sales'}, {o:'102        Jane Smith      Engineering'}, {o:'103        Sam Brown       Sales'}], explain: '<strong>Explanation:</strong> <code>%-10s</code> means a left-aligned string of 10 characters. <code>printf</code> ensures the columns line up perfectly. The <code>BEGIN</code> block prints the formatted header, and the main block prints the rows.' },

    // 14. STRING MANIPULATION
    { type: 'lesson', category: 'awk Advanced', title: 'awk: String Manipulation', subtitle: 'substr()', desc: 'Extract parts of a string using the <code>substr()</code> function. Useful for parsing fixed-width data or abbreviating text.', syntax: "awk -F: '{print substr($2, 1, 3)}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{print substr($2, 1, 3)}' employees.txt"}, {o:'Joh'}, {o:'Jan'}, {o:'Sam'}, {o:'Mar'}, {o:'Jam'}], explain: '<strong>Explanation:</strong> <code>substr($2, 1, 3)</code> takes the 2nd field (Name) and extracts characters starting at position 1, up to 3 characters long. This extracts the first 3 letters of each name.' },

    // 15. COUNTING ROWS
    { type: 'lesson', category: 'awk Advanced', title: 'awk: Counting Rows', subtitle: 'Tally Matches', desc: 'Combine pattern matching with a counter variable to find out exactly how many lines match a condition.', syntax: "awk -F: '/Engineering/ {count++} END {print \"Total Eng: \" count}' file", term: [{p:'/tmp/itp141_awk', c:"awk -F: '/Engineering/ {count++} END {print \"Total Eng: \" count}' employees.txt"}, {o:'Total Eng: 2'}], explain: '<strong>Explanation:</strong> For every line containing "Engineering", <code>count++</code> increments the variable by 1. The <code>END</code> block runs after the whole file is read, printing the final tally.' },

    // 16. LAB 1 (Section A)
    { type: 'lab', title: 'Lab 1 (Section A): Data Extraction', subtitle: 'Exercise', scenarioTitle: 'Extract Engineering Names', scenario: 'You need to generate a list of names for the Engineering department from the <code>employees.txt</code> file.', tasks: ['Use <code>awk</code> on <code>/tmp/itp141_awk/employees.txt</code>', 'Set field separator to colon <code>-F:</code>', 'Filter for lines containing "Engineering"', 'Print the 2nd field (Name)'], term: [] },
    
    // 17. LAB 1 SOLUTION
    { type: 'lab_solution', title: 'Lab 1 (Section A): Solution', subtitle: 'Solution', desc: 'Use awk with pattern matching and -F flag.', syntax: "awk -F: '/Engineering/ {print $2}' /tmp/itp141_awk/employees.txt", term: [{p:'/tmp/itp141_awk', c:"awk -F: '/Engineering/ {print $2}' employees.txt"}, {o:'Jane Smith'}, {o:'Mary Johnson'}], explain: '<strong>Explanation:</strong> <code>-F:</code> splits the file into columns. <code>/Engineering/</code> ensures the action only runs on lines matching that department. <code>{print $2}</code> outputs the name column for those specific lines.' },

    // 18. LAB 2 (Section B)
    { type: 'lab', title: 'Lab 2 (Section B): Field Counting', subtitle: 'Exercise', scenarioTitle: 'Audit Data Integrity', scenario: 'You are auditing the <code>employees.txt</code> file. A valid row must have exactly 4 fields. You need to print the line number of any row that does NOT have 4 fields.', tasks: ['Use <code>awk</code> on <code>/tmp/itp141_awk/employees.txt</code>', 'Set field separator to colon <code>-F:</code>', 'Use <code>NF</code> variable to check field count', 'Print <code>NR</code> if <code>NF != 4</code>'], term: [] },
    
    // 19. LAB 2 SOLUTION
    { type: 'lab_solution', title: 'Lab 2 (Section B): Solution', subtitle: 'Solution', desc: 'Use NF and NR built-in variables.', syntax: "awk -F: 'NF != 4 {print \"Bad data at line \" NR}' /tmp/itp141_awk/employees.txt", term: [{p:'/tmp/itp141_awk', c:"awk -F: 'NF != 4 {print \"Bad data at line \" NR}' employees.txt"}, {o:'(No output, all lines have 4 fields)'}, {p:'/tmp/itp141_awk', c:"echo '106:Bad Data:IT:60000:Extra' >> employees.txt"}, {p:'/tmp/itp141_awk', c:"awk -F: 'NF != 4 {print \"Bad data at line \" NR}' employees.txt"}, {o:'Bad data at line 6'}], explain: '<strong>Explanation:</strong> <code>NF != 4</code> is the pattern. It matches lines that do not have exactly 4 fields. <code>{print "Bad data at line " NR}</code> prints the line number where the error occurred. In a clean file, it outputs nothing.' },

    // 20. LAB 3 (Section C)
    { type: 'lab', title: 'Lab 3 (Section C): Report Generation', subtitle: 'Exercise', scenarioTitle: 'Generate Payroll Report', scenario: 'You need to generate a formatted payroll report. Print a header "EMPLOYEE REPORT", then the names of all employees, then a footer "END OF REPORT".', tasks: ['Use <code>awk</code> on <code>/tmp/itp141_awk/employees.txt</code>', 'Use <code>BEGIN</code> block to print header', 'Use middle block to print names ($2)', 'Use <code>END</code> block to print footer'], term: [] },
    
    // 21. LAB 3 SOLUTION
    { type: 'lab_solution', title: 'Lab 3 (Section C): Solution', subtitle: 'Solution', desc: 'Use BEGIN and END blocks.', syntax: "awk -F: 'BEGIN {print \"EMPLOYEE REPORT\"} {print $2} END {print \"END OF REPORT\"}' /tmp/itp141_awk/employees.txt", term: [{p:'/tmp/itp141_awk', c:"awk -F: 'BEGIN {print \"EMPLOYEE REPORT\"} {print $2} END {print \"END OF REPORT\"}' employees.txt"}, {o:'EMPLOYEE REPORT'}, {o:'John Doe'}, {o:'Jane Smith'}, {o:'Sam Brown'}, {o:'Mary Johnson'}, {o:'James Lee'}, {o:'END OF REPORT'}], explain: '<strong>Explanation:</strong> The <code>BEGIN</code> block executes before the file is read. The middle block <code>{print $2}</code> runs for every line. The <code>END</code> block executes after the last line is read. This creates a perfectly formatted report.' },

    // 22. LAB 4 (Section D)
    { type: 'lab', title: 'Lab 4 (Section D): Data Analysis', subtitle: 'Exercise', scenarioTitle: 'Average Engineering Salary', scenario: 'You need to calculate the average salary of the Engineering department. Sum their salaries, count them, and divide the total by the count.', tasks: ['Use <code>awk</code> on <code>/tmp/itp141_awk/employees.txt</code>', 'Filter for "Engineering" staff', 'In the action block, add salary ($4) to a sum, and increment a count', 'In <code>END</code> block, print sum divided by count'], term: [] },
    
    // 23. LAB 4 SOLUTION
    { type: 'lab_solution', title: 'Lab 4 (Section D): Solution', subtitle: 'Solution', desc: 'Use variables, pattern matching, and math in END block.', syntax: "awk -F: '/Engineering/ {sum += $4; count++} END {print \"Average: \" sum/count}' /tmp/itp141_awk/employees.txt", term: [{p:'/tmp/itp141_awk', c:"awk -F: '/Engineering/ {sum += $4; count++} END {print \"Average: \" sum/count}' employees.txt"}, {o:'Average: 90000'}], explain: '<strong>Explanation:</strong> For lines matching "Engineering", we add the 4th column to <code>sum</code> and add 1 to <code>count</code>. In the <code>END</code> block, we divide <code>sum</code> by <code>count</code> (180000 / 2) to get the average salary. Variables in awk start at 0 automatically.' },

    // 24. MASTER PIPELINE 1 (grep + awk)
    { type: 'lesson', category: 'Master Pipeline', title: 'Master Pipeline: grep + awk', subtitle: 'Advanced Log Parsing', desc: 'Combine grep to filter, and awk to extract and sum data. A classic industry-standard log analysis pipeline.', syntax: 'grep "pattern" file | awk "{sum += $2} END {print sum}"', term: [{p:'/tmp/itp141_awk', c:'grep "Engineering" employees.txt | awk -F: \'{sum += $4} END {print "Total Eng Salary: " sum}\''}, {o:'Total Eng Salary: 180000'}], explain: '<strong>Explanation:</strong> First, <code>grep</code> filters the file to only Engineering lines. Then, <code>awk</code> takes that stream, splits it by colon, sums the 4th column (salary), and prints the total. This is how sysadmins generate quick financial or traffic reports.' },

    // 25. MASTER PIPELINE 2 (sed + awk)
    { type: 'lesson', category: 'Master Pipeline', title: 'Master Pipeline: sed + awk', subtitle: 'User Generation', desc: 'Combine awk to extract data and sed to format it. A classic sysadmin pipeline for generating system usernames from a CSV.', syntax: "awk -F: '{print $2}' file | sed 's/ /_/g'", term: [{p:'/tmp/itp141_awk', c:"awk -F: '{print $2}' employees.txt | sed 's/ /_/g'"}, {o:'John_Doe'}, {o:'Jane_Smith'}, {o:'Sam_Brown'}, {o:'Mary_Johnson'}, {o:'James_Lee'}], explain: '<strong>Explanation:</strong> First, <code>awk</code> extracts the 2nd column (Name) from the colon-separated file. The pipe (<code>|</code>) passes these names to <code>sed</code>, which globally replaces spaces with underscores. This is exactly how sysadmins script bulk user creation.' },

    // 26. MASTER PIPELINE 3 (grep + sed + awk)
    { type: 'lesson', category: 'Master Pipeline', title: 'Master Pipeline: grep + sed + awk', subtitle: 'Complex Filtering', desc: 'Combine grep to filter, sed to reformat, and awk to process. The ultimate UNIX pipeline for log analysis and data extraction.', syntax: "grep 'pattern' file | sed 's/delim/newdelim/g' | awk '{condition}'", term: [{p:'/tmp/itp141_awk', c:"grep 'Engineering' employees.txt | sed 's/:/ /g' | awk '{if (\$4 > 80000) print \$1, \$2, \$4}'"}, {o:'102 Jane Smith 85000'}, {o:'104 Mary Johnson 95000'}], explain: '<strong>Explanation:</strong> <code>grep</code> isolates the Engineering staff. <code>sed</code> converts the colons to spaces. <code>awk</code> takes the space-separated stream, checks if the 4th column (salary) is greater than 80000, and prints the ID, Name, and Salary for those who qualify. Three tools, one seamless pipeline.' },

  {
    type: 'closing',
    header: 'MODULE 01 · TOPIC 03',
    tag: 'End of Topic 03',
    title: 'Access is power.<br><em>Control</em> it wisely.',
    quote: 'In Linux, permissions are not just a file property. They are your enforcement model for trust, isolation, and secure access.',
    leftCardNum: '§ ownership',
    leftCardTitle: 'Who owns the file?',
    leftCardDesc: 'Every file has a user owner and a group owner. Ownership drives accountability and helps administrators delegate access safely.',
    middleCardNum: '§ permissions',
    middleCardTitle: 'Read, write, execute',
    middleCardDesc: 'Use the classic rwx model to define what owners, groups, and everyone else may do. Permissions are the core of Linux security.',
    rightCardNum: '§ special bits',
    rightCardTitle: 'Setuid, Setgid, Sticky',
    rightCardDesc: 'Special modes extend the normal model. They are powerful tools, but they must be used carefully to avoid creating security vulnerabilities.'
  }
];
