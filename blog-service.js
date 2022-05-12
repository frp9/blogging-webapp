const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

var sequelize = new Sequelize('d60ok85531sg9l', 'moglwzdukvnfii', '5e545870efff34fce8fad4a2b2e6adde8a1738749f018e135b48be3e50744109', {
    host: 'ec2-3-225-213-67.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

//Model definition
const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

const Category = sequelize.define('Category', {

    category: Sequelize.STRING
});

//relating the Post and Category model
Post.belongsTo(Category, { foreignKey: 'category' });


module.exports.initialize = () => {

    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(resolve('Synchornized with datbase'))
            .catch(reject('Sychronization unsuccessful'))
            console.log("Database connection successful")
    });
}

module.exports.getAllPosts = () => {

    return new Promise((resolve, reject) => {
        Post.findAll()
            .then((data) => { 
                resolve(data)
            })
            .catch(() => reject('No results in return'))
    });
}

module.exports.getPostsByCategory = (category) => {

    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        })
        .then((data) => 
        {resolve(data)})
        .catch((err) => {
            reject('No results in return | Error:' + err)})
    });
};

module.exports.getPostsByMinDate = (minDateStr) => {

    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        })
        .then((data) => 
        {resolve(data)})
        .catch((err) => {reject('No results in return | Error:' + err)})
    });
}

module.exports.getPostById = (id) => {

    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        })
        .then((data) => {resolve(data[0])})
        .catch((err) => {reject('No results in return | Error:' + err)})
    });
}

module.exports.addPost = (postData) => {

    return new Promise((resolve, reject) => {

        postData.published = (postData.published) ? true : false;

        for (let i in postData) {
            if (postData[i] == "") { postData[i] = null; }
        }

        postData.postDate = new Date();

        Post.create(postData)
        .then(resolve(Post.findAll()))
        .catch(reject('Post not created'))
    });
}

module.exports.getPublishedPosts = () => {

    return new Promise((resolve, reject) => {
        
        Post.findAll({
            where: {
                published: true
            }
        })
        .then((data) => {resolve(data)})
        .catch((err) => {reject('No results in return  | Error: ' + err)})
    });
}

module.exports.getPublishedPostsByCategory = (category) => {

    return new Promise((resolve, reject) => {
        
        Post.findAll({
            where: {
                published: true,
                category: category  
            }
        })
        .then((data) => {resolve(data)})
        .catch((err) => {reject('No results in return | Error: '+ err)})
    });
}

module.exports.getCategories = () => {

    return new Promise((resolve, reject) => {
        Category.findAll()
        .then((data) => {resolve(data)})
        .catch((err) => {reject('No results in return | Error: ' + err)})
    });
}

module.exports.addCategory = (CategoryData) => {

    return new Promise((resolve, reject) => {

        for (let i in CategoryData) {
            if (CategoryData[i] == "") { 
                CategoryData[i] = null; 
            }
        }

        Category.create(CategoryData)
        .then(resolve(Category.findAll())) 
        .catch(reject('Category was not created'))

    })
}

module.exports.deleteCategoryById = (id) => {

    return new Promise((resolve, reject) => {

        Category.destroy({
            where: {
                id: id
            }
        })
        .then(resolve('Category Destroyed'))
        .catch(reject('Not able to delete Category'))
    })
}

module.exports.deletePostById = (id) => {

    return new Promise((resolve, reject) => {

        Post.destroy({
            where: {
                id: id
            }
        })
        .then(resolve('Post Destoryed'))
        .catch(reject('Not able to delete Post'))
    })
}