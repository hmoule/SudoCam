import flask
from flask import request
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from SudokuExtractor import extract_sudoku
from NumberExtractor import extract_number
from SolveSudoku import sudoku_solver

UPLOAD_FOLDER = '.'
app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["DEBUG"] = True

def output(a):
    sys.stdout.write(str(a))

def display_sudoku(sudoku):
    for i in range(9):
        for j in range(9):
            cell = sudoku[i][j]
            if cell == 0 or isinstance(cell, set):
                output('.')
            else:
                output(cell)
            if (j + 1) % 3 == 0 and j < 8:
                output(' |')

            if j != 8:
                output('  ')
        output('\n')
        if (i + 1) % 3 == 0 and i < 8:
            output("--------+----------+---------\n")

@app.route('/solve', methods=['POST'])
def solve():
    print (request.method)
    print (request.form)
    print (request.files['file'])
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    image = extract_sudoku('./file.jpg')
    grid = extract_number(image)
    print('Sudoku:')
    display_sudoku(grid.tolist())
    solution = sudoku_solver(grid)
    print('Solution:')
    display_sudoku(solution.tolist())
    return request.data
app.run()