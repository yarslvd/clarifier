const { posts, comments, posts_categories, categories, postsLikes, users } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');
const { parseJwt } = require('../utils/jwt');
const Op = require('sequelize').Op

const User = new UserClass();

exports.getAllPostAuthorID = async (req, res) => {
    try {
        console.log(req.params);
        const data = await User.findAndCountAll(posts, { where: { authorID: req.params.user_id } });
        return res.json(data);
    }
    catch(err) {
        console.log(err);
        return res.status(500).send('Some error occured');
    }
}

exports.getAllPosts = async (req, res) => {
    let { page } = req.query;
    if(page < 1) {
        page = 1;
    }
    const size = 5;
    const { limit, offset } = getPagination(page, size);

    console.log(req.query);

    if(req.query.sort) {
        if(req.query.sort.id != 'asc' && req.query.sort.id != 'desc' &&
            req.query.sort.rating != 'asc' && req.query.sort.rating != 'desc') {
            return res.status(400).send('Bad request');
        }
    }

    if(req.query.filter) {
        if(req.query.filter.dateFrom || req.query.filter.dateTo) {
            console.log(new Date(req.query.filter.dateTo));
        }
        if(req.query.filter.status || req.query.filter.status) {
            if(req.query.filter.status != 'inactive' && req.query.filter.status != 'active') {
                return res.status(400).send('Bad request');
            }
        }
    }

    try {
        let data;

        if(!req.query.sort && !req.query.filter) {
            data = await User.findAndCountAll(posts, {where: {},
            limit, offset, order: [[ 'id', 'DESC' ]] });
        }

        if(req.query.sort || req.query.filter) {
            if(req.query.sort && !req.query.filter) {
                data = await User.findAndCountAll(posts, {where: {},
                limit, offset, order: [[ Object.keys(req.query.sort)[0], Object.values(req.query.sort)[0].toUpperCase() ]] });
            }
            else if(!req.query.sort && req.query.filter) {
                let conditions = Object.assign({}, req.query.filter);
                if(conditions.category) {
                    try {
                        console.log(conditions.category);
                        let arr = conditions.category.split(',');
                        console.log(arr);
                        let mas = [];
                        for(let el of arr) {
                            let result = await User.findAll(posts_categories, { where: { categoryID: +el } });
                            mas.push(result);
                        }
                        mas = mas.flat()
                        delete conditions.category;
                        conditions.id = mas.map(el => el.dataValues.postID);
                        console.log(conditions.id);
                    }
                    catch(err) {
                        return res.status(500).send('Error');
                    }
                }

                if(conditions.dateFrom && conditions.dateTo) {
                    conditions.publishDate = { [Op.between] : [conditions.dateFrom, conditions.dateTo] }
                    delete conditions.dateFrom;
                    delete conditions.dateTo;
                }
                else if(conditions.dateFrom) {
                    conditions.publishDate = { [Op.gte] : conditions.dateFrom }
                    delete conditions.dateFrom;
                }
                else if(conditions.dateTo) {
                    conditions.publishDate = { [Op.lte] : conditions.dateTo }
                    delete conditions.dateTo;
                }

                if(conditions.status == 'active') {
                    conditions.status = true;
                }
                else if (conditions.status == 'inactive') {
                    conditions.status = false;
                }

                data = await User.findAndCountAll(posts, {where: conditions,
                    limit, offset, order: [[ 'id', 'DESC' ]] });
            }
            else {
                try {
                    let conditions = Object.assign({}, req.query.filter);
                    console.log('sdfsdf');
                    if(conditions.category) {
                        try {
                            console.log(conditions.category);
                            let arr = conditions.category.split(',');
                            console.log(arr);
                            let mas = [];
                            for(let el of arr) {
                                let result = await User.findAll(posts_categories, { where: { categoryID: +el } });
                                mas.push(result);
                            }
                            mas = mas.flat()
                            delete conditions.category;
                            conditions.id = mas.map(el => el.dataValues.postID);
                            console.log(conditions.id);
                        }
                        catch(err) {
                            return res.status(500).send('Error');
                        }
                    }

                    if(conditions.dateFrom && conditions.dateTo) {
                        conditions.publishDate = { [Op.between] : [conditions.dateFrom, conditions.dateTo] }
                        delete conditions.dateFrom;
                        delete conditions.dateTo;
                    }
                    else if(conditions.dateFrom) {
                        conditions.publishDate = { [Op.gte] : conditions.dateFrom }
                        delete conditions.dateFrom;
                    }
                    else if(conditions.dateTo) {
                        conditions.publishDate = { [Op.lte] : conditions.dateTo }
                        delete conditions.dateTo;
                    }

                    if(conditions.status == 'active') {
                        conditions.status = true;
                    }
                    else if (conditions.status == 'inactive') {
                        conditions.status = false;
                    }

                    data = await User.findAndCountAll(posts, { where: conditions,
                        limit, offset, order: [[ Object.keys(req.query.sort)[0], Object.values(req.query.sort)[0].toUpperCase() ]] });
                }
                catch(err) {
                    console.error(err);
                    return res.status(500).send('Some error occured');
                }
            }
        }
        
        const response = getPagingData(data, page, limit);
        return res.send(response);
    }
    catch(err) {
        return res.send(500).send('Some error occured while receiving posts');
    }
}

exports.getPost = async (req, res) => {
    const result = await User.findOne(posts, { where: { id: +req.params.post_id } });
    if(result === null) {
        return res.status(404).send('Post has not been found');
    }
    return res.json(result);
}

exports.getComments = async (req, res) => {
    const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
    if(post === null) {
        return res.status(404).send('Such post has not been found');
    }

    const result = await User.findAll(comments, { where: { postID: +req.params.post_id } });
    if(!result.length) {
        return res.send([]);
    }

    return res.json(result.map(el => el.dataValues));
}

exports.addComment = async (req, res) => {
    try {
        let check = await User.findOne(posts, { where: { id: +req.params.post_id, status: true } });
        if(check === null) {
            return res.send('Sorry, you can not comment under locked posts');
        }
        await User.create(comments, { authorID: req.user.id, postID: +req.params.post_id, publishDate: getCurrentDate(), content: req.body.content});
        return res.send('Comment has been successfully added');
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened during posting this comment. Try again!');
    }
}

exports.getCategories = async (req, res) => {
    try {
        let result = await User.findAll(posts_categories, { where: { postID: req.params.post_id }});
        result = await User.findAll(categories, { where: { id:result.map(el => el.dataValues.categoryID) } });
        return res.json(result.map(el => el.name));
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while loading post categories');
    }
}

exports.getLikes = async (req, res) => {
    try {
        let result = await User.findAll(postsLikes, { where: { postID: req.params.post_id } });
        return res.json(result);
    }
    catch(err) {
        console.error(err);
    }
}

exports.createPost = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    try {
        console.log(req.body.category);

        await User.create(posts, { authorID: obj.id, title: req.body.title, 
            publishDate: getCurrentDate(), content: req.body.content, status: 1} );
        let post = await User.findOne(posts, { where: { authorID: obj.id, title: req.body.title } } );
        //let categories = req.body.category.split(', ');
        for(let i of req.body.category) {
            await User.create(posts_categories, { postID: post.dataValues.id, categoryID: i });
        }
        return res.json(post);
    }
    catch(err) {
        console.error(err);
        return res.status(500).send('Some error happened while creating the post');
    }
}

exports.addLike = async (req, res) => {
    let check = await User.findOne(postsLikes, { where: { authorID: req.user.id, postID: +req.params.post_id } });
    if(check !== null) {
        if(check.dataValues.type === 'like' && req.body.type === 'dislike') {
            await User.update(postsLikes, { type: 'dislike' }, { where: { authorID: req.user.id, postID: +req.params.post_id } });
            const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
            const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });

            await User.update(posts, { rating: post.dataValues.rating - 2 }, { where: { id: +req.params.post_id } });
            await User.update(users, { rating: user.dataValues.rating - 2 }, { where: { id: post.dataValues.authorID } });
            return res.send('You have successfully changed like to dislike');
        }
        if(check.dataValues.type === 'dislike' && req.body.type === 'like') {
            await User.update(postsLikes, { type: 'like' }, { where: { authorID: req.user.id, postID: +req.params.post_id } });
            const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
            const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });

            await User.update(posts, { rating: post.dataValues.rating + 2 }, { where: { id: +req.params.post_id } });
            await User.update(users, { rating: user.dataValues.rating + 2 }, { where: { id: post.dataValues.authorID } });
            return res.send('You have successfully changed dislike to like');
        }
        if(check.dataValues.type === 'dislike' && req.body.type === 'dislike' ||
                check.dataValues.type === 'like' && req.body.type === 'like') {
            return res.send('You have already liked/disliked this post');
        }
    }

    try {
        if(req.body.type === 'like') {
            await User.create(postsLikes, { authorID: req.user.id, postID: +req.params.post_id, publishDate: getCurrentDate(), type: 'like' } );

            const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
            const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });

            await User.update(posts, { rating: post.dataValues.rating + 1 }, { where: { id: +req.params.post_id } });
            await User.update(users, { rating: user.dataValues.rating + 1 }, { where: { id: post.dataValues.authorID } });
            return res.send('Like was successfully added');
        }
        if(req.body.type === 'dislike') {
            await User.create(postsLikes, { authorID: req.user.id, postID: +req.params.post_id, publishDate: getCurrentDate(), type: 'dislike' } );

            const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
            const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });

            await User.update(posts, { rating: post.dataValues.rating - 1 }, { where: { id: +req.params.post_id } });
            await User.update(users, { rating: user.dataValues.rating - 1 }, { where: { id: post.dataValues.authorID } });
            return res.send('Dislike was successfully added');
        }
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while adding like to this post');
    }
    
    return res.send('Please provide like/dislike in JSON');
}

exports.editPost = async (req, res) => {
    let obj = parseJwt(req.cookies.token);

    let check = await User.findOne(posts, { where: { id: +req.params.post_id, authorID: obj.id } });

    if(check !== null || req.user.role === 'admin') {
        try {
            await User.update(posts, { title: req.body.title, content: req.body.content, status: req.body.status }, { where: { id: +req.params.post_id } });
            return res.send('Your post has been successfully updated');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while editing the post');
        }
    }
    else {
        return res.send('There is no such post or you are not the author');
    }
}

// ADD DELTE POST AS A ADMIN
exports.deletePost = async (req, res) => {
    let check = await User.findOne(posts, { where: { id: +req.params.post_id, authorID: req.user.id } });
    let cat = await User.findAll(posts_categories, { where: { postID: +req.params.post_id } });
    console.log(cat);

    if(check !== null || req.user.role === 'admin') {
        try {
            if(cat) {
                await User.delete(posts_categories, { where: { postID: +req.params.post_id } });
            }
            await User.delete(posts, { where: { id: +req.params.post_id } });
            return res.send('Post has been successfully deleted');
        }
        catch(err) {
            console.error(err);
            res.status(500).send('Some error happened while deleting the post');
        }
    }
    else {
        return res.status(403).send('You have no permission to delete this post');
    }
}

exports.deleteLike = async (req, res) => {
    let check = await User.findOne(postsLikes, { where: { authorID: req.user.id, postID: +req.params.post_id } });

    if(check !== null) {
        try{
            if(await User.findOne(postsLikes, { where: { postID: +req.params.post_id, authorID: req.user.id } }) == null) {
                return res.send('There is no like on that comment');
            }
            if(check.dataValues.type === 'like') {
                await User.delete(postsLikes, { where: { postID: +req.params.post_id, authorID: req.user.id } });
    
                const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
                const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });
        
                await User.update(posts, { rating: post.dataValues.rating - 1 }, { where: { id: +req.params.post_id } });
                await User.update(users, { rating: user.dataValues.rating - 1 }, { where: { id: post.dataValues.authorID } });
                return res.send('You have successfully deleted the like');
            }
            if(check.dataValues.type === 'dislike') {
                await User.delete(postsLikes, { where: { postID: +req.params.post_id, authorID: req.user.id } });
    
                const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
                const user = await User.findOne(users, { where: { id: post.dataValues.authorID } });
        
                await User.update(posts, { rating: post.dataValues.rating + 1 }, { where: { id: +req.params.post_id } });
                await User.update(users, { rating: user.dataValues.rating + 1 }, { where: { id: post.dataValues.authorID } });
                return res.send('You have successfully deleted the dislike');
            }
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while deleting the comment like or dislike');
        }
    }
    else {
        return res.send('You have not liked this post');
    }
}



function getCurrentDate() {
    return new Date().toISOString().substring(0, 19).replace('T', ' ');
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, posts, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    let offset = page ? (+page - 1) * limit : 0;
  
    return { limit, offset };
};