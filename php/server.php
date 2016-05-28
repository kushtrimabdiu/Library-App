<?php
    session_start();
	require_once('model/books.php');
    require_once('model/clients.php');
    require_once('model/admin.php');

    if (isset($_REQUEST['command'])) {
        $book = new Book();
        $client = new Client();
        $admin = new Admin();
        //get all the books
        if ($_REQUEST['command'] == 'get_all_books') {
            $books = $book->getAllBooks();
            $json_books = json_encode($books);
            print_r($json_books);
        }
        else if ($_REQUEST['command'] == 'get_all_books_for_admin') {
            $books = $book->getAllBooksForAdmin();
            $json_books = json_encode($books);
            print_r($json_books);
        }
        else if ($_REQUEST['command'] == 'register') {
            $result = $client->registerNewClient($_REQUEST['new_user']);
            if ($result == 'success') {
                $_SESSION['user'] = $_REQUEST['new_user'];
                $_SESSION['user']['payed_subscription'] = 0;
                $_SESSION['user']['books_read'] = 0;
            }
            echo $result;
        }
        else if ($_REQUEST['command'] == 'get_session') {
            $session = json_encode($_SESSION['user']);
            print_r($session);
        }
        else if ($_REQUEST['command'] == 'admin_session') {
            $session = json_encode($_SESSION['admin']);
            print_r($session);
        }
        else if ($_REQUEST['command'] == 'logout') {
            unset($_SESSION['user']);
            print_r($_SESSION);
        }
        else if ($_REQUEST['command'] == 'admin_logout') {
            unset($_SESSION['admin']);
            print_r($_SESSION);
        }
        else if ($_REQUEST['command'] == 'authenticate') {
            $result = $client->authenticateUser($_REQUEST['username'],$_REQUEST['password']);
            if ($result == 0) {
                echo 'fail';
            }
            else {
                $_SESSION['user'] = $result;
                echo 'success';
            }
        }
        else if ($_REQUEST['command'] == 'authenticate_admin') {
            $result = $admin->authenticateAdmin($_REQUEST['usr'],$_REQUEST['pwd']);
            if ($result == 0) {
                echo 'fail';
            }
            else {
                $_SESSION['admin'] = $result;
                echo 'success';
            }
        }
        else if ($_REQUEST['command'] == 'reserve_book') {
            echo $client->reserveBookWithID($_REQUEST['book_id']);
        }
        else if ($_REQUEST['command'] == 'update_account') {
            echo $client->updateUserInfo($_REQUEST['user']);
        }
        else if ($_REQUEST['command'] == 'update_password') {
            echo $client->updateUserPassword($_REQUEST['pwd']);
        }
        else if ($_REQUEST['command'] == 'my_books') {
            $my_books = $client->getAllMyBooksRead();
            $json_my_books = json_encode($my_books);

            print_r($json_my_books);
        }
        else if ($_REQUEST['command'] == 'notify_me_on_book_return') {
            echo $book->notifyMeOnBookReturn($_REQUEST['book_id']);
        }
        else if ($_REQUEST['command'] == 'get_book_with_id') {
            $book_info = $book->getBookWithID($_REQUEST['book_id']);
            $json_book_info = json_encode($book_info);
            print_r($json_book_info);
        }
        else if ($_REQUEST['command'] == 'get_all_users') {
            //get all the users so we can select from
            $all_users = $client->getAllUsers();
            $all_users_json = json_encode($all_users);
            print_r($all_users_json);
        }
        else if ($_REQUEST['command'] == 'huazo_librin') {
            echo $client->loandBookWithID($_REQUEST['book_id'],$_REQUEST['user_id']);
        }
        else if ($_REQUEST['command'] == 'return_book') {
            echo $book->returnBookWithID($_REQUEST['loan_id'],$_REQUEST['book_id']);
        }
        else if ($_REQUEST['command'] == 'book_picked_up') {
            echo $book->bookPickedUp($_REQUEST['loan_id']);
        }
        else if ($_REQUEST['command'] == 'admin_statistics') {
            $admin_statistics = $admin->adminStatistics();
            $admin_statistics_json = json_encode($admin_statistics);
            print_r($admin_statistics_json);
        }
        else if ($_REQUEST['command'] == 'pay_subscription') {
            echo $admin->paySubscription($_REQUEST['user_id']);
        }
        else if ($_REQUEST['command'] == 'add_new_book') {
            echo $book->addNewBook($_REQUEST['new_book']);
        }

    }

?>
