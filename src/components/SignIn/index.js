const SignIn = ({ loginWithGoogle, signInAnon }) => {
	return (
		<>
			<div>
				<div>
					<h1>Please Login.</h1>
					<p>Lorem Ipsum.</p>
					<div>
						<button onClick={loginWithGoogle}>Continue with Google</button>
						<button onClick={signInAnon}>
							Continue as Guest <sup>*</sup>
						</button>
					</div>
					<p>
						<sup>*</sup> Your data will be deleted once you log out.
					</p>
				</div>
			</div>
		</>
	);
};

export default SignIn;
