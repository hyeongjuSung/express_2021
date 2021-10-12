export default (sequelize, DataTypes) => {
    //테이블 정의
    const Permission = sequelize.define("permission", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true
        }
        // 테이블 생성시 createdAt, updatedAt 자동 생성
    });
    // 테이블간의 연관관계 설정, userId 외래키 추가
    Permission.associate = function(models) {
        models.Permission.belongsTo(models.User);
        // 외래키 이름 변경 시 foreignKey: '이름' 으로 설정
    };
    return Permission;
};