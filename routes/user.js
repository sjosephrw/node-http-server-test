const { uploadImage, searchUser, getAll, getOne, updateOne, deleteOne, processModifyPassword, processModifyEmail, processSearchData } = require('../controllers/user');

const user = (req, res) => {

    let finalUrlSegment;

    if (req.url.includes("?")) {
      finalUrlSegment  = req.url.split('?')[0].split('/')[4];
    } else {
      finalUrlSegment = req.url.split('/')[4];
    }

    console.log(finalUrlSegment);


    if (finalUrlSegment === 'profile-img'){

        uploadImage(req, res);

    } else if (finalUrlSegment === 'search'){

        searchUser(req, res, processSearchData);

    } else if (finalUrlSegment === 'modify-password' && req.url.includes("?") && req.method === 'PATCH'){

        updateOne(req, res, processModifyPassword);

    } else if (finalUrlSegment === 'modify-email' && req.url.includes("?") && req.method === 'PATCH'){

        updateOne(req, res, processModifyEmail);

    } else if (req.url.includes("?") && req.method === 'GET'){

        getOne(req, res);

    } else if (req.url.includes("?") && req.method === 'PATCH'){

        //updateOne(req, res);

    } else if (req.url.includes("?") && req.method === 'DELETE'){

        deleteOne(req, res);

    } else if (!req.url.includes("?") && req.method === 'GET'){

        getAll(req, res);

    }


}

module.exports = user;
