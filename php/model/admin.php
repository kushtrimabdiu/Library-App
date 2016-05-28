<?php
	class Admin
	{
		public $CONNECTION;
		/**
		**THIS IS THE CONSTRUCTOR
		**/
		public function __construct(){
            $this->CONNECTION = mysqli_connect("localhost","root","qTLw4k+H","rikdb")
                                or die('something went wrong!'.mysqli_connect_error());
        }

        public function authenticateAdmin($usr,$pass)
        {
            $username = mysqli_real_escape_string($this->CONNECTION, $usr);
			$password = mysqli_real_escape_string($this->CONNECTION, $pass);
            //query
            $query = "SELECT *FROM admin WHERE username='".$username."' AND password='".$password."'";
            $result = $this->CONNECTION->query($query);
            $result_rows = mysqli_num_rows($result);
            $row = mysqli_fetch_array($result);

            if ($result_rows>0) {
                return $row;
            }

            return 0;
        }

        public function adminStatistics()
        {
            $statistics = array();
            //nr of users
            $query_nr_users = "SELECT COUNT(*) AS total_users FROM subscribers";
            $user_results = $this->CONNECTION->query($query_nr_users);
            $total_users_results = mysqli_fetch_array($user_results);
            $statistics['total_users'] = $total_users_results['total_users'];
            //nr of female users
            $query_nr_users_female = "SELECT COUNT(*) AS total_female_users FROM subscribers WHERE gjinija='f'";
            $female_results = $this->CONNECTION->query($query_nr_users_female);
            $total_female_results = mysqli_fetch_array($female_results);
            $statistics['total_female_users'] = $total_female_results['total_female_users'];
            //nr of male users
            $query_nr_users_male = "SELECT COUNT(*) AS total_male_users FROM subscribers WHERE gjinija='m'";
            $male_results = $this->CONNECTION->query($query_nr_users_male);
            $total_male_results = mysqli_fetch_array($male_results);
            $statistics['total_male_users'] = $total_male_results['total_male_users'];
            //total books
            $query_total_books = "SELECT COUNT(*) as total_books FROM books";
            $books_results = $this->CONNECTION->query($query_total_books);
            $total_books_results = mysqli_fetch_array($books_results);
            $statistics['total_books'] = $total_books_results['total_books'];
            //total books hired
            $query_books_hired = "SELECT COUNT(*) as total_hired FROM books WHERE available=0";
            $hired_books_results = $this->CONNECTION->query($query_books_hired);
            $total_books_hired_results = mysqli_fetch_array($hired_books_results);
            $statistics['total_books_hired'] = $total_books_hired_results['total_hired'];
            //books read up until now
            $query_total_books_read = "SELECT COUNT(*) as total_books_read FROM loan";
            $books_read_results = $this->CONNECTION->query($query_total_books_read);
            $total_books_read_results = mysqli_fetch_array($books_read_results);
            $statistics['total_books_read'] = $total_books_read_results['total_books_read'];

            return $statistics;
        }

		public function paySubscription($user_id)
		{
			$user_id = mysqli_real_escape_string($this->CONNECTION, $user_id);
			$query = "UPDATE subscribers SET payed_subscription=1 WHERE id=".$user_id;
			if ($this->CONNECTION->query($query) === TRUE) {
				return 'success';
			}
			return 'fail';
		}
    }
?>
