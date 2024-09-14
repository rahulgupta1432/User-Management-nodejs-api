const User = require('../model/UserModel'); // Adjust the path as needed

const deleteAllUsers = async () => {
    try {
        await User.destroy({
            where: {}, // This empty `where` clause means "match all records"
            truncate: true // This option ensures the table is emptied
        });
        console.log('All users have been deleted');
    } catch (error) {
        console.error('Error deleting users:', error);
    }
};

// deleteAllUsers();

module.exports = deleteAllUsers;
