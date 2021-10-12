import {Router} from "express";
import bcrypt from "bcrypt";
import db from '../models/index.js'

const { User, Permission, Board } = db;

const userRouter = Router();
/*
    REST API
    *CRUD
    *유저 생성, 조회, 수정, 삭제

*/
//localhost:3000/users (get)
userRouter.get("/", async(req, res) => {
    try{
        // req.query => localhost:3000/users?name=홍길동&age=12
        // req.query.name => 홍길동
        // req.query.age => 12
        let { name, age } = req.query;
        const { Op } = db.sequelize;
        const findUserQuery = {
            attributes: ['id', 'name', 'age'],
            include: [Permission]
        }
        let result;
        // where 조건에 따라 분기
        if(name && age) {
            findUserQuery['where'] = { name: {[Op.substring]: name}, age }
        }else if(name) {
            findUserQuery['where'] = { name: {[Op.substring]: name} }
        }else if(age) {
            findUserQuery['where'] = { age }
        }

        result = await User.findAll(findUserQuery);
        console.log("전체 유저 조회");
        res.status(200).send({
            count: result.length,
            result
        })
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

//localhost:3000/users/:id
userRouter.get("/:id", async(req, res) => {
    try{
        const findUser = await User.findOne({
            //include: [Permission, Board], 모든 컬럼을 조회할 경우
            include: [{
                model: Permission,
                attributes: ["id", "title", "level"]
            }, { 
                model: Board,
                attributes: ["id", "title"]
            }],// 컬럼 필터나 조건 걸기
            where: {
                id: req.params.id
            }
        });
        res.status(200).send({findUser})
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

//유저생성
//localhost:3000/users (post)
userRouter.post("/", async(req, res) => {
    try{
        //get과 다르게 req.query가 아닌 req.body에서 값을 가지고 옴
        const { name, age, password, permission } = req.body;
        if(!name || !age || !password || !permission) res.status(400).send({msg: "입력 요청 값이 잘못되었습니다."})
        else {
            //key, value가 같을 경우 생략 가능
            //const result = await User.create({name: name, age: age});
            const hashpwd = await bcrypt.hash(password, 4); // password hash 처리
            const user = await User.create({name, age, password: hashpwd});

            await user.createPermission({
                title: permission.title,
                level: permission.level
            })

            res.status(201).send({
                msg: `id ${user.id}, ${user.name} 유저가 생성되었습니다.`
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

//name 변경
userRouter.put("/:id", async(req, res) => {
    try{
        const { name, age } = req.body;
        let user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user || (!name && !age)) {
            res.status(400).send({msg: '해당 유저가 존재하지 않거나 입력 요청 값이 잘못 되었습니다.'});
        } else {
            if(name) user.name = name;
            if(age)  user.age  = age;

            await user.save();
            res.status(200).send({ msg: '유저 정보가 수정되었습니다.'});
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({ msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'});
    }
});

//user 지우기
userRouter.delete("/:id", async(req, res) => {
    try{
        let user = await User.findOne({
            where:{
                id: req.params.id
            }
        })
        if(!user){
            res.status(400).send({msg: '해당 유저는 존재하지 않습니다.'});
        } else {
            await user.destroy();
            res.status(200).send({msg: '유저 정보가 삭제되었습니다.'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'})
    }

});

userRouter.get("/test/:id", async(req, res) => {
    try{
        // findAll
        const Op = sequelize.Op;
        const userResult = await User.findAll({
            attributes: ['id', 'name', 'age', 'updatedAt'],
            where : {
                /*
                    (
                        (`user`, `name`, LIKE '이%' AND `user`.`age` = 35)
                        OR
                        (`user`, `name`, LIKE '문%' AND `user`.`age` = 35)
                    )
                */
                [Op.or] : [{
                    [Op.and]: {
                        name: { [Op.startsWith] : "이" },
                        age: { [Op.between] : [30, 35] }
                    }
                    },{
                    [Op.and]: {
                        name: { [Op.startsWith] : "문" },
                        age: { [Op.between] : [25,30] }
                    }
                }]
            },
            order : [['age', 'DESC'],['name', 'ASC']]
        });

        const boardResult = await Board.findAll({
            attributes: ['id', 'title', 'updatedAt', 'createdAt'],
            limit: 100
        });

        const user = await User.findOne({
            where : {id: req.params.id}
        });
        const board = await Board.findOne({
            where : {id: req.params.id}
        });

        if(!user || !board){
            res.status(400).send({msg: "해당 정보가 존재하지 않습니다"});
        }
        await user.destroy();
        board.title += "test 타이틀입니다.";
        await board.save();

        res.status(200).send({
            users: {
                count: userResult.length,
                data: userResult
            },
            boards: {
                count: boardResult.length,
                data: boardResult
            }
        })
    } catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

export default userRouter