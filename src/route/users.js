import {Router} from "express";
import _ from "lodash";
import faker from "faker";
faker.locale = "ko";

const userRouter = Router();

// let users = [{
//     id: 1,
//     name: "홍길동",
//     age: 21
// },{
//     id: 2,
//     name: "김길동",
//     age: 25
// },{
//     id: 3,
//     name: "오길동",
//     age: 28
// },{
//     id: 4,
//     name: "고길동",
//     age: 33
// },{
//     id: 5,
//     name: "박길동",
//     age: 40
// }];
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


let users = [];
for(let i=1; i<10000; i+=1) {
    users.push({
        id: i,
        name: faker.name.lastName()+faker.name.firstName(),
        age: getRandomInt(15,50),
    })
}

userRouter.get("/", (req, res) => {
    let { name, age } = req.query;
    let filteredUsers = users;
    if(name) {
        filteredUsers = _.filter(filteredUsers, (user)=>{
            return user.name.includes(name);
        });
    }

    if(age) {
        filteredUsers = _.filter(filteredUsers, ['age', parseInt(age)])
    }
    res.send({
        count: filteredUsers.length,
        filteredUsers
    });
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
userRouter.post("/", (req, res) => {
    const createUser = req.body;
    const check_user = _.find(users, ["id", createUser.id]);

    let result;
    if(!check_user && createUser.id && createUser.name && createUser.age){
        users.push(createUser);
        result = `${createUser.name}님을 생성했습니다.`
    } else {
        result = '입력 요청값이 잘못되었습니다.'
    }

    res.status(201).send({
        result
    });
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