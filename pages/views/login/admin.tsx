import { ChangeEvent, Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

const handleChange = (setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
  setter(e.target.value);
};

const AdminPage = () => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const isLongPassword = useMemo(() => password.length > 7, [password]);

  const isMatched = useMemo(() => {
    return password.length !== 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  return (
    <div>
      <div>
        <p>Please create the initail administrator user.</p>
        <div>
          <span>Username</span>
          <input type="text" value={username} onChange={handleChange(setUsername)} />
        </div>
        <div>
          <span>Password</span>
          <input type="password" value={password} onChange={handleChange(setPassword)} />
        </div>
        <div>
          <span>Confirm password</span>
          <input type="password" value={confirmPassword} onChange={handleChange(setConfirmPassword)} />
          <span>{isMatched ? 'O' : 'X'}</span>
        </div>
        <p>
          <span>{isLongPassword ? 'O' : 'X'}</span>The password must be at least 8 characters long
        </p>
        <button>Create user</button>
      </div>
    </div>
  );
};

export default AdminPage;
