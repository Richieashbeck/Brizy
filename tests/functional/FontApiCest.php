<?php

class FontApiCest {
	public function _before( FunctionalTester $I ) {
		$I->loginAs( 'admin', 'admin' );
		@$I->cleanUploadsDir();
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function createFontTest( FunctionalTester $I ) {
		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION ] ), [
			'family' => $fontFamily,
		], [
			'fonts' => [
				'400' => [
					'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
					'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
				],
				'500' => [
					'eot'   => codecept_data_dir( 'fonts/pn-medium-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-medium-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-medium-webfont.woff2' ),
				],
				'700' => [
					'eot'   => codecept_data_dir( 'fonts/pn-bold-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-bold-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' ),
				],
			]
		] );

		$font = json_decode( $response = $I->grabResponse() );

		$I->seeResponseCodeIsSuccessful();

		$I->assertTrue( isset( $font->data ), 'Response should contain property: data' );

		$font = $font->data;

		$I->assertTrue( isset( $font->uid ), 'Response should contain property: uid' );
		$I->assertTrue( isset( $font->postId ), 'Response should contain property: postId' );

		$I->seeResponseCodeIsSuccessful();
		$I->seePostInDatabase( [
			'ID'          => $font->postId,
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );


		$postsTable = $I->grabPostsTableName();

		$attachmentCount = $I->countRowsInDatabase( $postsTable, [
			'post_type'   => 'attachment',
			'post_parent' => $font->postId
		] );

		$I->assertEquals( 10, $attachmentCount, 'Is should create 10 attachments' );

		$I->seePostMetaInDatabase( [
			'post_id'    => $font->postId,
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $font->uid
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '400'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '500'
		] );

		$I->seePostMetaInDatabase( [
			'meta_key'   => 'brizy-font-weight',
			'meta_value' => '700'
		] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function getFontCssTest( FunctionalTester $I ) {
		$I->wantToTest( 'The CSS file return for a font family' );
		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION ] ), [
			'family' => $fontFamily,
		], [
			'fonts' => [
				'400' => [
					'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
					'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
				],
				'500' => [
					'eot'   => codecept_data_dir( 'fonts/pn-medium-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-medium-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-medium-webfont.woff2' ),
				],
				'700' => [
					'eot'   => codecept_data_dir( 'fonts/pn-bold-webfont.eot' ),
					'woff'  => codecept_data_dir( 'fonts/pn-bold-webfont.woff' ),
					'woff2' => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' ),
				],
			]
		] );

		$I->seeResponseCodeIsSuccessful();


		$I->sendGET( '/?' . build_query( [ Brizy_Admin_Fonts_Handler::ENDPOINT => "proxima_nova:400,500,700" ] ) );

		$I->seeResponseCodeIsSuccessful();
		$I->seeHttpHeader( 'Content-Type', 'text/css;charset=UTF-8' );

		$I->see( 'pn-regular-webfont.ttf' );
		$I->see( 'pn-regular-webfont.eot' );
		$I->see( 'pn-regular-webfont.woff' );
		$I->see( 'pn-regular-webfont.woff2' );
		$I->see( 'pn-medium-webfont.eot' );
		$I->see( 'pn-medium-webfont.woff' );
		$I->see( 'pn-medium-webfont.woff2' );
		$I->see( 'pn-bold-webfont.eot' );
		$I->see( 'pn-bold-webfont.woff' );
		$I->see( 'pn-bold-webfont.woff2' );
	}


	/**
	 * @param FunctionalTester $I
	 */
	public function deleteFont( FunctionalTester $I ) {

		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333',
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'attachment',
			'post_parent' => $fontId,
			'meta_input'  => [
				'brizy-font-weight'    => 400,
				'brizy-font-file-type' => 'ttf'
			],
		] );

		$fontFamily = 'proxima_nova';
		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'family' => $fontFamily,
		] );

		$I->seeResponseCodeIsSuccessful();

		$I->dontSeePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );

		$I->dontSeeAttachmentInDatabase( [ 'post_parent' => $fontId ] );

		$I->cantSeePostMetaInDatabase( [
			'post_id'  => $fontId,
			'meta_key' => 'brizy-font-weight',
		] );

		$I->cantSeePostMetaInDatabase( [
			'post_id'  => $fontId,
			'meta_key' => 'brizy-font-file-type',
		] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function deleteUnknownFont( FunctionalTester $I ) {

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'family' => 'unknown',
		] );

		$I->canSeeResponseCodeIs( 404 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function deleteInvalidFontRequest( FunctionalTester $I ) {

		$fontFamily = 'proxima_nova';
		$fontId     = $I->havePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
			'meta_input'  => [
				'brizy_post_uid' => 'gffbf00297b0b4e9ee27af32a7b79c333',
			],
		] );

		$I->havePostInDatabase( [
			'post_type'   => 'attachment',
			'post_parent' => $fontId,
			'meta_input'  => [
				'brizy-font-weight'    => 400,
				'brizy-font-file-type' => 'ttf'
			],
		] );

		$I->sendPOST( '/wp-admin/admin-ajax.php?' . build_query( [ 'action' => Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION ] ), [
			'bad_family' => 'unknown',
		] );


		$I->seePostInDatabase( [
			'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
			'post_title'  => $fontFamily,
			'post_name'   => $fontFamily,
			'post_status' => 'publish',
		] );

		$I->canSeeResponseCodeIs( 400 );
	}
}
