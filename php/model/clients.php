<?php
	class Client
	{
		public $CONNECTION;
		/**
		**THIS IS THE CONSTRUCTOR
		**/
		public function __construct()
        {
            $this->CONNECTION = mysqli_connect("localhost","root","qTLw4k+H","rikdb")
                                or die('something went wrong!'.mysqli_connect_error());
        }

        public function registerNewClient($client_hash)
        {
            $firstName = mysqli_real_escape_string($this->CONNECTION, $client_hash['name']);
			$secondName = mysqli_real_escape_string($this->CONNECTION, $client_hash['surname']);
            $email = mysqli_real_escape_string($this->CONNECTION, $client_hash['email']);
			$tel_no = mysqli_real_escape_string($this->CONNECTION, $client_hash['tel_no']);
            $gjinija = mysqli_real_escape_string($this->CONNECTION, $client_hash['gjinija']);
            $username = mysqli_real_escape_string($this->CONNECTION, $client_hash['username']);
			$password = md5(mysqli_real_escape_string($this->CONNECTION, $client_hash['password']));
			$birthday = mysqli_real_escape_string($this->CONNECTION, $client_hash['birthday']);
            $proffession = mysqli_real_escape_string($this->CONNECTION, $client_hash['occupation']);

            $birthday = substr($birthday, 0, strpos($birthday, '('));
            $birthday = date('Y-m-d h:i:s', strtotime($birthday));

            $query = sprintf("INSERT INTO subscribers(name,surname,email,gjinija,username,password,birthday,tel_no,occupation,books_read) ".
                             "VALUES('".$firstName."','".$secondName."','".$email."','".$gjinija."','".$username."',".
                             "'".$password."','".$birthday."','".$tel_no."','".$proffession."',0)");

            if ($this->CONNECTION->query($query) === TRUE) {
				$status ='success';
			} else {
				$status ='fail';
			}

            return $status;
        }

        public function authenticateUser($username,$password)
        {
            $username = mysqli_real_escape_string($this->CONNECTION, $username);
			$password = md5(mysqli_real_escape_string($this->CONNECTION, $password));

            $query = "SELECT *FROM subscribers WHERE username='".$username."' AND password='".$password."'";
            $result = $this->CONNECTION->query($query);
            $result_rows = mysqli_num_rows($result);
            $row = mysqli_fetch_array($result);

            if ($result_rows>0) {
                return $row;
            }

            return 0;
        }

        public function reserveBookWithID($book_id)
        {
            $query_user_id = "SELECT id FROM subscribers WHERE username='".$_SESSION['user']['username']."'";
            $result = $this->CONNECTION->query($query_user_id);
            $row_id = mysqli_fetch_array($result);
            //insert into loan table
            $query = "INSERT INTO loan(subscriber_id,book_id,returned) ".
                     "VALUES(".$row_id['id'].",".$book_id.",false)";

            if ($this->CONNECTION->query($query) === TRUE) {
				$query_status = "UPDATE books SET available=0 WHERE id='".$book_id."'";
				if ($this->CONNECTION->query($query_status) === TRUE) {
					$status ='success';
				}
				else {
					$status = 'fail';
				}
			} else {
				$status ='fail';
			}

            return $status;
        }

		public function loandBookWithID($book_id,$user_id)
		{
			$query = "INSERT INTO loan(subscriber_id,book_id,picked_up,returned) ".
                     "VALUES(".$user_id.",".$book_id.",1,false)";

			 if ($this->CONNECTION->query($query) === TRUE) {
 				$query_status = "UPDATE books SET available=0 WHERE id='".$book_id."'";
 				if ($this->CONNECTION->query($query_status) === TRUE) {
 					$status ='success';
 				}
 				else {
 					$status = 'fail';
 				}
 			} else {
 				$status ='fail';
 			}

             return $status;
		}

        public function updateUserInfo($user_array)
        {
			$name = mysqli_real_escape_string($this->CONNECTION, $user_array['name']);
			$surname = mysqli_real_escape_string($this->CONNECTION, $user_array['surname']);
			$email = mysqli_real_escape_string($this->CONNECTION, $user_array['email']);
			$occupation = mysqli_real_escape_string($this->CONNECTION, $user_array['occupation']);
			$tel_no = mysqli_real_escape_string($this->CONNECTION, $user_array['tel_no']);

            $query = "UPDATE subscribers SET name='".$name."',surname='".$surname."',".
                     "email='".$email."',occupation='".$occupation."',tel_no='".$tel_no."' ".
                     "WHERE username='".$_SESSION['user']['username']."'";
		    echo $query;
            if ($this->CONNECTION->query($query) === TRUE) {
				$status ='success';
                $_SESSION['user']['name'] = $name;
                $_SESSION['user']['surname'] = $surname;
                $_SESSION['user']['email'] = $email;
                $_SESSION['user']['occupation'] = $email;
				$_SESSION['user']['tel_no'] = $tel_no;

			} else {
				$status ='fail';
			}

            return $status;
        }

        public function updateUserPassword($pwd)
        {
			$password = md5(mysqli_real_escape_string($this->CONNECTION, $pwd));
            $query = "UPDATE subscribers SET password='".$password."' WHERE username='".$_SESSION['user']['username']."'";
            if ($this->CONNECTION->query($query) === TRUE) {
                $status ='success';
                if (isset($_SESSION['user']['password'])) {
                    $_SESSION['user']['password'] = $pwd;
                }
            } else {
				$status ='fail';
			}

            return $status;
        }

        public function getIDForUsername()
        {
            $query = "SELECT id FROM subscribers WHERE username='".$_SESSION['user']['username']."'";
            $result = $this->CONNECTION->query($query);
            $row_id = mysqli_fetch_array($result);

            return $row_id['id'];
        }

        public function getAllMyBooksRead()
        {
            $my_books = array();
            $user_id = $this->getIDForUsername();
            $query = "SELECT *FROM books b, loan l WHERE l.book_id=b.id AND l.subscriber_id='".$user_id."'";
            $result = $this->CONNECTION->query($query);
            while($row = mysqli_fetch_array($result)) {
                array_push($my_books,$row);
            }

            return $my_books;
        }

		public function getAllUsers()
		{
			$all_users = array();
			$query = "SELECT *FROM subscribers";
			$result = $this->CONNECTION->query($query);
			while($row = mysqli_fetch_array($result)) {
                array_push($all_users,$row);
            }

            return $all_users;
		}
    }
?>
