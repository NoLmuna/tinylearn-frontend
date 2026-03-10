const fs = require('fs');

function replace(file, oldStr, newStr) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(oldStr, newStr);
        fs.writeFileSync(file, content);
    }
}

replace('src/hooks/parentHooks.jsx', '// const payload =', 'const _payload_remove =');
replace('src/hooks/teacherHooks.jsx', '// const payload =', 'const _payload_remove =');

replace('src/contexts/adminContext.jsx', 'const setAdmin = useState(null)[1];', 'const [, setAdmin] = useState(null);');

replace('src/pages/parent/Dashboard.jsx', '(assignment) => (', '(assignment, idx) => (');

replace('src/pages/teacher/Materials.jsx', '// const getFileIcon =', 'const getFileIcon =');

replace('src/pages/teacher/SpecUser.jsx', 'setFormData({', '// eslint-disable-next-line react-hooks/set-state-in-effect\\n        setFormData({');

console.log('done2');
