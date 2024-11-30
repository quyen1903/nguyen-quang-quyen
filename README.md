Technical Stack
Nodejs, Typescript
Framework Express
MongoDB, ORM mongoose
design pattern: singleton connect database

cách build:
đầu tiên clone source code về với git clone sau đó npm i để thêm các package 
tải mongodb về để lưu database, tải mongo compass để giám sát database
nhớ để file .env trong root folder của dự án
có 2 cách chạy code
1 là tsc để compile ts thành js sau đó npm run start như bình thường
2 là chạy trực tiếp bằng lệnh ts-node server.ts

các chức năng:
1 register
2 login
3 logout
4 dùng refreshtoken trả về token mới
5 đổi mật khẩu
6 update tài khoản
7 fulltextsearch để tìm tên các user
8 xem thông tin cá nhân
9 xóa tài khoản
chức năng phụ :
log ra các hoạt động của db 
trong file app.js có dòng code số 40
/* check for database connection */
// CheckConnect.checkOverload()

uncomment dòng này sẽ check connect và CPU cùng với RAM sử dụng

đường đi của dữ liệu: 
khi 1 route cụ thể được kích hoạt, controller riêng biệt của route đó sẽ xử lý code
data được đưa vào từ route sẽ đi qua DTO để validate, em cũng viết riêng 2 file validate username và password
nếu valid thì sẽ đưa vào service để xử lý business, còn invalid thì throw ra lỗi
service xử lý business và chuyển data cho repository để tương tác trực tiếp với database
sau khi repository xong việc sẽ trả data về cho service, service trả về cho controller
controller sẽ Response cho user, folder để xử lý response hay request lỗi là folder Core

Business
User register sẽ thêm salt vào password và hash password mới lưu vào db, đồng thời trả về cặp token
salt và mật khẩu đã băm được lưu trong db, không ai biết mật khẩu thật

đăng nhập thì lấy salt trong db ra và dùng cùng 1 hàm băm rồi mới so sánh xem mật khẩu đã thêm muối và băm có giống mật khẩu trong db không
đồng thời đăng nhập xong trả về cặp token mới

jwt dùng cặp khóa publickey và privatekey, privatekey dùng để tạo access/refresh token, còn publickey dùng để xác thực xem token có đúng không
chỉ lưu publickey trong db, không lưu token và không lưu privatekey trong db

muốn đăng xuất thì xóa publickey trong db đi 

xử lý refreshtoken: dùng refreshtoken để lấy về cặp token mới, đồng thời lưu refreshtoken cũ lại
nếu có người dùng refreshtoken cũ, người này muốn đánh cắp thông tin hoặc ý đồ bất chính, bắt đăng nhập lại

đổi mật khảu thì xác nhận accesstoken có đúng không và mật khẩu có đúng không? nếu đúng cho phép đổi mật khẩu
đổi mật khẩu thì đổi salt mới luôn, và băm mật khẩu rồi lưu lại như cách triển khai login

update account thì xem xét xem có đúng token không, nếu đúng thì kiểm tra tiếp username đang muốn đổi có bị trùng không
username nếu bị trùng thì throw ra lỗi đề nghị dùng username khác
sau đó dùng findbyidandupdate để đảm bảo fields chúng ta update là unique

search account thì có đánh index fullname để tìm các người dùng cùng tên cùng họ

read account vì có trả về username là nhạy cảm nên phải có xác thực bằng token

delete account cũng phải có xác thực token mới được phép

nếu anh phỏng vấn đọc đến đây, lưu ý là trong route, những route nào nằm ở trên dòng code này
router.use(authentication)
thì sẽ không cần dùng token xác thực, các route ở dưới dòng code này sẽ cần dùng token xác thực
còn vài chức năng nữa như validator của dto cũng như validate username password trong dto em chưa nêu.
em xin cảm ơn, rất mong có cơ hội được làm việc cùng với anh, 
