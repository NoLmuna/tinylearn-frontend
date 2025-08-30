/* eslint-disable no-undef */
const { User, StudentParent } = require('./src/models');
require('dotenv').config();

async function checkRelationships() {
  try {
    console.log('=== PARENT-STUDENT RELATIONSHIPS ===');
    const relationships = await StudentParent.findAll({
      include: [
        { model: User, as: 'parent', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'student', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });
    
    console.log('Total relationships:', relationships.length);
    relationships.forEach(rel => {
      console.log(`Parent: ${rel.parent.firstName} ${rel.parent.lastName} -> Student: ${rel.student.firstName} ${rel.student.lastName}`);
    });
    
    // Check if Michael Johnson (parent) is in the relationships
    console.log('\n=== CHECKING MICHAEL JOHNSON ===');
    const michael = await User.findOne({ where: { email: 'parent@tinylearn.com' } });
    if (michael) {
      const michaelRelationships = await StudentParent.findAll({
        where: { parentId: michael.id },
        include: [{ model: User, as: 'student', attributes: ['firstName', 'lastName'] }]
      });
      console.log(`Michael has ${michaelRelationships.length} children`);
      michaelRelationships.forEach(rel => {
        console.log(`- ${rel.student.firstName} ${rel.student.lastName}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRelationships();
