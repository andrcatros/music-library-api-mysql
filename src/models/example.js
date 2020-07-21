module.exports = (sequelize, DataTypes) => {
    const schema = {
        exampleKey: DataTypes.STRING
    };

    const Example = sequelize.define('Example', schema);
    return Example;
}