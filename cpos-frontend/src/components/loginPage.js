import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);
    // Here, you can add authentication logic or API calls`
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-body-tertiary">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center">
            <h1 className="display-4">CPOS</h1>
          </div>
          <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <div className="form-floating mb-2">
            <input 
              type="email" 
              className="form-control" 
              id="floatingInput" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating mb-2">
            <input 
              type="password" 
              className="form-control" 
              id="floatingPassword" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
          <p className="mt-5 mb-3 text-body-secondary text-center">© TangonanTech–2025</p>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;