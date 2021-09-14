import {Router} from "express";
import _ from "lodash";

const boardRouter = Router();

let boards = [{
    id: 1,
    title: "게시판 타이틀입니다.",
    content: "게시판 내용입니다.",
    createDate: "2021-09-07",
    updateDate: "2021-10-07"
}, {
    id: 2,
    title: "게시판 타이틀2입니다.",
    content: "게시판 내용2입니다.",
    createDate: "2021-09-08",
    updateDate: "2021-10-08"
}, {
    id: 3,
    title: "게시판 타이틀3입니다.",
    content: "게시판 내용3입니다.",
    createDate: "2021-09-09",
    updateDate: "2021-10-09"
}, {
    id: 4,
    title: "게시판 타이틀4입니다.",
    content: "게시판 내용4입니다.",
    createDate: "2021-09-10",
    updateDate: "2021-10-10"
}, {
    id: 5,
    title: "게시판 타이틀5입니다.",
    content: "게시판 내용5입니다.",
    createDate: "2021-09-11",
    updateDate: "2021-10-11"
}];

boardRouter.get("/", (req, res) => {
    res.send({
        count: boards.length,
        boards
    });
});

boardRouter.get("/:id", (req, res) => {
    const findBoard = _.find(boards, {id: parseInt(req.params.id)});
    let msg;

    if(findBoard){
        msg = "정상적으로 조회되었습니다."
        res.status(200).send({
            msg,
            findBoard
        });
    } else {
        msg = "해당 아이디를 가진 게시글이 없습니다."
        res.status(400).send({
            msg,
            findBoard
        });
    }
    
});

//글생성
boardRouter.post("/", (req, res) => {
    const createBoard = req.body;
    const check_board = _.find(boards, ["id", createBoard.id]);

    let result;
    if(!check_board && createBoard.id && createBoard.title && createBoard.content && createBoard.createDate && createBoard.updateDate){
        boards.push(createBoard);
        result = `${createBoard.id}번 글을 생성했습니다.`
    } else {
        result = '입력 요청값이 잘못되었습니다.'
    }

    res.status(201).send({
        result
    });
});

//content 변경
boardRouter.put("/:id", (req, res) => {
    const find_board_idx = _.findIndex(boards, {id: parseInt(req.params.id)});
    let result;

    if(find_board_idx !== -1){
        boards[find_board_idx].content = req.body.content;
        result = "성공적으로 수정되었습니다."
        res.status(200).send({
            result
        })
    } else {
        result = `아이디가 ${req.params.id}번인 게시글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        })
    }
});

//게시글 지우기
boardRouter.delete("/:id", (req, res) => {
    const check_board = _.find(boards, {id: parseInt(req.params.id)});
    let result;

    // 같은 아이디 값을 가진 값이 있으면?
    if(check_board){
        // lodash의 reject 메서드를 이용해 해당 id를 가진 객체를 삭제
        boards = _.reject(boards, ["id", parseInt(req.params.id)]);
        result = "성공적으로 삭제 되었습니다."; 
        res.status(200).send({
            result
        });
    } else {
        result = `${req.params.id} 아이디를 가진 게시글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        })
    }

});

export default boardRouter