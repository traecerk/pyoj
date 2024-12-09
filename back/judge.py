import subprocess
import os

import subprocess
import os

class Judge:
    def __init__(self, code: str, problem_ID: str):
        self.code = code
        self.true_answer = ""
        self.path = f"Problems/{problem_ID}"
        self.output = []
        # 从 path 目录下读入正确答案文件
        answer_file = f"{self.path}/answer.txt"
        if os.path.exists(answer_file):
            with open(answer_file, "r") as f:
                self.true_answer = f.read()

    def execute_code(self):
        # 创建一个临时文件来保存用户的代码
        with open(f"{self.path}/user_code.py", "w") as f:
            f.write(self.code)

        # 从 path 目录下读入输入文件
        input_file = f"{self.path}/input.txt"
        if os.path.exists(input_file):
            with open(input_file, "r") as f:
                input_data = f.read()
        else:
            input_data = ""

        # 执行用户的代码，并捕获输出
        try:
            result = subprocess.run(['python', f"{self.path}/user_code.py"], input=input_data, capture_output=True, text=True, timeout=5)
            self.output = result.stdout.strip()
        except subprocess.TimeoutExpired:
            self.output = "Time Limit Exceeded"
        except Exception as e:
            self.output = f"Error: {e}"

    def compare_answers(self):
        # 比较用户的输出和正确答案
        if self.output == self.true_answer:
            return True
        else:
            return False
        



    def judge(self):
        self.execute_code()
        return self.compare_answers()
