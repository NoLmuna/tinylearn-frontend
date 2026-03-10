const fs = require('fs');

function replace(file, oldStr, newStr) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(oldStr, newStr);
        fs.writeFileSync(file, content);
    }
}

// 1. badge.jsx fast refresh
replace('src/components/ui/badge.jsx', 'export const badgeVariants', 'const badgeVariants');
replace('src/components/ui/badge.jsx', 'export { Badge, badgeVariants }', 'export { Badge }');

// 2. adminContext.jsx fast refresh & unused
replace('src/contexts/adminContext.jsx', 'const [_, setAdmin] = useState(null);', 'const setAdmin = useState(null)[1];');

// 3. hooks unused vars
replace('src/hooks/parentHooks.jsx', 'const { login } = useAuth();', '');
replace('src/hooks/parentHooks.jsx', 'const payload =', '// const payload =');
replace('src/hooks/teacherHooks.jsx', 'const { login } = useAuth();', '');
replace('src/hooks/teacherHooks.jsx', 'const payload =', '// const payload =');

// 4. parent/Dashboard.jsx unused
replace('src/pages/parent/Dashboard.jsx', '(assignment, idx)', '(assignment)');

// 5. student/Dashboard.jsx unused
replace('src/pages/student/Dashboard.jsx', 'import { useState, useEffect }', 'import { useState }');
replace('src/pages/student/Dashboard.jsx', 'const { user, logout, setUser }', 'const { user, logout }');

// 6. teacher/Materials.jsx unused
replace('src/pages/teacher/Materials.jsx', 'const getFileIcon =', '// const getFileIcon =');

console.log('Done fix_lint');
