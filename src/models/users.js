//esm
export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return User;
};

// cjs - commonjs module
// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define("user", {
//         name: {
//             type: sequelize.STRING,
//             allowNull: false
//         },
//         age: {
//             type: sequelize.INTEGER,
//             allowNull: false
//         },
//         password: {
//             type: sequelize.STRING,
//             allowNull: true
//         }
//     });
//     return User;
// };

