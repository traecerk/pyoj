from typing import Union
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from judge import Judge

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: str):
    problem_path = f"./problems/{problem_id}/{problem_id}.md"
    if os.path.exists(problem_path):
        with open(problem_path, "r",  encoding="utf-8") as file:
            description = file.read()
        return JSONResponse(content={"description": description})
    else:
        raise HTTPException(status_code=404, detail="Problem not found")
    
@app.post("/api/submit/{problem_id}")
async def submit_code(problem_id: str, request: Request):
    data = await request.json()
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Code not provided")

    judge = Judge(code, problem_id)
    result = judge.judge()
    return JSONResponse(content={
        "result": result
    })