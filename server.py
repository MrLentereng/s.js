from flask import Flask, request, render_template, redirect, url_for, flash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'  # Папка для хранения файлов
app.secret_key = os.urandom(24)  # Замените на свой секретный ключ

# Разрешённые типы файлов
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Получение данных формы
        surname = request.form.get('surname')
        firstname = request.form.get('firstname')
        id_type = request.form.get('id-type')
        id_number = request.form.get('id-number')
        bank_account = request.form.get('bank-account')
        bank_type = request.form.get('bank-type')
        swift_code = request.form.get('swift-code')
        email = request.form.get('email')
        residence_country = request.form.get('residence-country')

        # Обработка адреса в зависимости от выбранной страны
        address_data = {}
        if residence_country == 'ukraine':
            address_data = {
                'region': request.form.get('ukraine-region'),
                'district': request.form.get('ukraine-district'),
                'city': request.form.get('ukraine-city'),
                'street': request.form.get('ukraine-street'),
                'house': request.form.get('ukraine-house'),
                'apartment': request.form.get('ukraine-apartment'),
                'postal': request.form.get('ukraine-postal')
            }
        elif residence_country == 'poland':
            address_data = {
                'wojewodztwo': request.form.get('poland-wojewodztwo'),
                'powiant': request.form.get('poland-powiant'),
                'gmina': request.form.get('poland-gmina'),
                'city': request.form.get('poland-city'),
                'street': request.form.get('poland-street'),
                'house': request.form.get('poland-house'),
                'apartment': request.form.get('poland-apartment'),
                'postal': request.form.get('poland-postal')
            }
        elif residence_country == 'other':
            address_data = {
                'address': request.form.get('other-address-input'),
                'postal': request.form.get('other-postal')
            }

        # Обработка файлов
        pit11_files = request.files.getlist('pit-11[]')
        pit2023_files = request.files.getlist('pit-2023[]')

        # Создание папки с фамилией и именем
        user_folder = os.path.join(app.config['UPLOAD_FOLDER'], f"{surname}_{firstname}")
        if not os.path.exists(user_folder):
            os.makedirs(user_folder)

        # Сохранение файлов в папку пользователя
        pit11_files_saved = []
        pit2023_files_saved = []
        
        if pit11_files:
            for file in pit11_files:
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(user_folder, filename)
                    file.save(filepath)
                    pit11_files_saved.append(filepath)

        if pit2023_files:
            for file in pit2023_files:
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(user_folder, filename)
                    file.save(filepath)
                    pit2023_files_saved.append(filepath)

        # Здесь можно записать данные в базу данных или файл
        # Например, записать в текстовый файл
        with open(os.path.join(user_folder, 'form_data.txt'), 'a') as f:
            f.write(f"Surname: {surname}\n")
            f.write(f"Firstname: {firstname}\n")
            f.write(f"ID Type: {id_type}\n")
            f.write(f"ID Number: {id_number}\n")
            f.write(f"Bank Account: {bank_account}\n")
            f.write(f"Bank Type: {bank_type}\n")
            f.write(f"Swift Code: {swift_code}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Residence Country: {residence_country}\n")
            f.write(f"Address Data: {address_data}\n")
            f.write(f"PIT-11 Files: {pit11_files_saved}\n")
            f.write(f"PIT-2023 Files: {pit2023_files_saved}\n")
            f.write("\n" + "="*20 + "\n")

        # Сообщение об успешной отправке
        flash('Форма успешно отправлена!')
        return redirect(url_for('index'))

    return render_template('index.html')

if __name__ == '__main__':
    # Создание папки для файлов, если она не существует
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    app.run(debug=True)
