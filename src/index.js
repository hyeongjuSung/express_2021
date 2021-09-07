import express from "express";
import _ from "lodash";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000);

const users = [{
    id: 1,
    name: "홍길동",
    age: 21
},{
    id: 2,
    name: "김길동",
    age: 25
},{
    id: 3,
    name: "오길동",
    age: 28
},{
    id: 4,
    name: "고길동",
    age: 33
},{
    id: 5,
    name: "박길동",
    age: 40
}];

let user;

app.get("/users", (req, res) => {
    res.send(user);
});

app.get("/users/:id", (req, res) => {
    const result = _.find(users, {id: parseInt(req.params.id)});
    res.send(result);
});

//유저생성
app.post("/users", (req, res) => {
    const createUser = req.body;
    let result;
    if(createUser.id && createUser.name && createUser.age){
        //users.push(user);
        user = createUser;
        result = `${user.name}님을 생성했습니다.`
    } else {
        result = '입력 요청값이 잘못되었습니다.'
    }

    res.send({
        result
    });
});

//name 변경
app.put("/users/:id", (req, res) => {
    let result;

    if(user && user.id == req.params.id){
        user.name = req.body.name;
        result = `유저 이름을 ${user.name}으로 변경`;
    } else {
        result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
    }

    res.send({
        result
    });
    // let id = req.params.id;
    // const updateUser = req.body;
    // let result;
    // if(id == user.id){
    //     user.name = updateUser.name;
    //     result = '이름이 수정되었습니다.'
    // } else {
    //     result = '수정에 실패하였습니다.'
    // }

    // res.send({
    //     result
    // });
});

//user 지우기
app.delete("/users/:id", (req, res) => {
    let result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
    if(user && user.id == req.params.id){
        user = null;
        result = `아이디가 ${req.params.id}인 유저 삭제`; 
    }

    res.send({
        result
    });
    // let id = req.params.id;
    // let result;
    // if(id == user.id){
    //     user = null;
    //     result = '삭제가 완료되었습니다.'
    // } else {
    //     result = '삭제에 실패하였습니다.'
    // }
    // res.send("user "+req.params.id+" delete");
});
