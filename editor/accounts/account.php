<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 11/26/18
 * Time: 5:00 PM
 */

class Brizy_Editor_Accounts_Account extends Brizy_Editor_Accounts_AbstractAccount {

	/**
	 * @return mixed
	 */
	public function getGroup() {
		return Brizy_Editor_Accounts_AbstractAccount::INTEGRATIONS_GROUP;
	}

	/**
	 * @return mixed
	 */
	public function getService() {
		return $this->data['service'];
	}


	/**
	 * @param $data
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {

		$data['group'] = Brizy_Editor_Accounts_AbstractAccount::INTEGRATIONS_GROUP;

		return Brizy_Editor_Accounts_AbstractAccount::createFromSerializedData( $data );
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Accounts_AbstractAccount
	 * @throws Exception
	 */
	public static function createFromJson( $json_obj ) {

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		if ( is_object( $json_obj ) ) {
			$json_obj->group = Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP;

			return Brizy_Editor_Accounts_AbstractAccount::createFromJson( get_object_vars( $json_obj ) );
		}

		throw new Exception( 'Invalid json provided.' );
	}

}
