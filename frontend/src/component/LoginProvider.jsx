import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {useToast} from "@chakra-ui/react";


export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();


  console.log(authority)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function isLoggedOut() {
    return Date.now() > expired * 1000;
  }


  function hasAccess(param) {
    return id == param;
  }

  function isAdmin() {
    return authority.includes("ADMIN");
  }

  function isHost() {
    return authority.includes("HOST");
  }

  function isUser() {
    return authority.includes("USER");
  }





  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickname(payload.nickname);
    setMobile(payload.mobile);
    setEmail(payload.email);
    console.log(id);
    setAuthority(payload.scope.split(" "));
  }

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("com.naver.nid.oauth.state_token");
    setExpired(0);
    setId("");
    setMobile("");
    setEmail("");
    setNickname("");
    setAuthority([]);

    // 모든 쿠키 삭제 함수 정의
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
    };

    // 모든 쿠키 삭제
    deleteAllCookies();

    sessionStorage.clear();

    toast({
      status: "success",
      description : "로그아웃 되었습니다",
      position : "top"
    })

    window.location.reload();


  }


  return (
    <LoginContext.Provider
      value={{
        id: id,
        nickname: nickname,
        authority: authority,
        email : email,
        mobile : mobile,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        isLoggedOut:isLoggedOut,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
        isHost: isHost,
        isUser: isUser,

      }}
    >
      {children}
    </LoginContext.Provider>
  );
}


