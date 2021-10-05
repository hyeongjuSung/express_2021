import {Router} from "express";

import db from '../models/index.js'

faker.locale = "ko";
const { User } = db;

const userRouter = Router();

userRouter.get("/", async(req, res) => {
    try{
        let { name, age } = req.query;
        const { Op } = db.sequelize;
        const findUserQuery = {
            attributes: ['id', 'name', 'age'],
        }
        let result;

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

userRouter.get("/:id", async(req, res) => {
    try{
        const findUser = await User.findOne({
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
userRouter.post("/", async(req, res) => {
    try{
        const { name, age } = req.body;
        if(!name || !age) res.status(400).send({msg: "입력 요청 값이 잘못되었습니다."})
        
        //key, value가 같을 경우 생략 가능
        //const result = await User.create({name: name, age: age});
        const result = await User.create({name, age});
        res.status(201).send({
            msg: `id ${result.id}, ${result.name} 유저가 생성되었습니다.`
        });
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
        }

        if(name) user.name = name;
        if(age)  user.age  = age;

        await user.save();

        res.status(200).send({ msg: '유저 정보가 수정되었습니다.'});

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
        }
        await user.destroy();
        res.status(200).send({msg: '유저 정보가 삭제되었습니다.'});

    }catch(err){
        console.log(err);
        res.status(500).send({msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'})
    }

});

userRouter.get("/test/:id", async(req, res) => {
    try{
        // findAll
        //User.findAll().then(result => result)
        const Op = sequelize.Op;
        const userResult = await User.findAll({
            attributes: ['id', 'name', 'age', 'updatedAt'],
            where : {
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