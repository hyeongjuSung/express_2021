import {Router} from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
faker.locale = "ko";

const seq = new sequelize('express', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

const check_sequelize_auth = async () => {
    try{
        await seq.authenticate();
        console.log('연결 성공');
    }catch(err){
        console.log('연결 실패', err);
    }
};
check_sequelize_auth();

const User = seq.define("user", {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    age: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

const user_sync = async() => {
    try{
        await User.sync({force:true});
        for(let i=0; i<100; i++){
            User.create({
                name: faker.name.lastName()+faker.name.firstName(),
                age: getRandomInt(15,50)
            })
        }
    }catch(err){
        console.log(err)
    }   
}
user_sync();

const userRouter = Router();

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

let users = [];

userRouter.get("/", async(req, res) => {
    try{
        let { name, age } = req.query;
        const { Op } = sequelize;
        const findUserQuery = {
            attributes: ['name', 'age'],
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

        res.status(200).send({
            count: result.length,
            result
        })
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

userRouter.get("/:id", (req, res) => {
    const findUser = _.find(users, {id: parseInt(req.params.id)});
    let msg;

    if(findUser){
        msg = "정상적으로 조회되었습니다."
        res.status(200).send({
            msg,
            findUser
        });
    } else {
        msg = "해당 아이디를 가진 유저가 없습니다."
        res.status(400).send({
            msg,
            findUser
        });
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
userRouter.put("/:id", (req, res) => {
    const find_user_idx = _.findIndex(users, {id: parseInt(req.params.id)});
    let result;

    if(find_user_idx !== -1){
        users[find_user_idx].name = req.body.name;
        result = "성공적으로 수정되었습니다."
        res.status(200).send({
            result
        })
    } else {
        result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
        res.status(400).send({
            result
        })
    }
});

//user 지우기
userRouter.delete("/:id", (req, res) => {
    // lodash find 메서드를 이용해서 요청아 들어온 :id 값을 가진 users 안의 객체가 있는지 체크
    const check_user = _.find(users, {id: parseInt(req.params.id)});
    let result;

    // 같은 아이디 값을 가진 값이 있으면?
    if(check_user){
        // lodash의 reject 메서드를 이용해 해당 id를 가진 객체를 삭제
        users = _.reject(users, ["id", parseInt(req.params.id)]);
        result = "성공적으로 삭제 되었습니다."; 
        res.status(200).send({
            result
        });
    } else {
        result = `${req.params.id} 아이디를 가진 유저가 존재하지 않습니다.`;
        res.status(400).send({
            result
        })
    }

});

export default userRouter