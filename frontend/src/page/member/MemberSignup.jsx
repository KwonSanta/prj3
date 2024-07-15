import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";
import NaverLogin from "./NaverLogin.jsx";
import { FiLock, FiMail, FiSmartphone, FiUser } from "react-icons/fi";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [mobile, setMobile] = useState();
  const [signUp, setSignUp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSmsCodeSent, setIsSmsCodeSent] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [capsLockWarning, setCapsLockWarning] = useState(false);
  const [isCodeSentEmail, setIsCodeSentEmail] = useState(false);
  const [isCodeSentPhone, setIsCodeSentPhone] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleCapsLockWarning = (e) => {
    const isCapsLockOn = e.getModifierState("CapsLock");
    setCapsLockWarning(isCapsLockOn);
  };

  function handleSignup() {
    setIsLoading(true);
    axios
      .post("/api/member/signup", {
        email: email,
        password: password,
        nickname: nickname,
        mobile: mobile,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다",
          position: "top",
        });
        navigate("/member/login");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다",
          position: "top",
        });
      })
      .catch((err) => {
        toast({
          status: "success",
          description: "사용할 수 있는 이메일입니다",
          position: "top",
        });
        setIsCheckedEmail(true);
      })
      .finally(() => {
        setIsCodeSentEmail(false);
      });
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${nickname}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다",
          position: "top",
        });
      })
      .catch((err) => {
        toast({
          status: "success",
          description: "사용할 수 있는 닉네임입니다",
          position: " top",
        });
        setIsCheckedNickName(true);
      });
  }

  let isDisabled = false;

  if (!password === passwordCheck) {
    isDisabled = true;
  }
  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickname.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (!isCheckedEmail) {
    isDisabled = true;
  }

  if (!isCheckedNickName) {
    isDisabled = true;
  }

  if (!isValidEmail) {
    isDisabled = true;
  }

  // if (isSmsCodeSent) {
  //   isDisabled = true;
  // }

  // if (!signUp) {
  //   isDisabled = true;
  // }

  const sendNumber = () => {
    console.log("email", email);

    axios
      .get(`/api/member/e1?mail=${email}`)
      .then((response) => {
        alert("인증번호 발송");
        setVerificationCode(response.data.number);
        setExpirationTime(response.data.expirationTime);
        setIsCodeSent(true);
      })
      .catch((error) => {
        console.error("Error sending verification code:", error);
      });
  };

  const confirmNumber = () => {
    if (inputCode == verificationCode) {
      alert("인증되었습니다.");
      setIsCodeSent(false);
      setIsCodeSentEmail(true);
    } else {
      alert("인증에 실패했습니다");
    }
  };

  const sendNumberMobile = () => {
    axios
      .get(`/api/member/p1?mobile=${mobile}`)
      .then((response) => {
        alert("인증번호 발송");
        setVerificationCode(response.data.verificationCode);
        setExpirationTime(response.data.expirationTime);
        setIsSmsCodeSent(true);
      })
      .catch((error) => {
        console.error("Error sending verification code:", error);
      });
  };

  const confirmNumberMobile = () => {
    if (inputCode == verificationCode) {
      alert("인증되었습니다.");
      setIsSmsCodeSent(false);
      setIsCodeSentPhone(true);
      setSignUp(true);

      axios.post("/api/member/phone", {
        memberId: account.id,
        mobile: mobile,
      });

      window.location.reload();
    } else {
      alert("인증에 실패했습니다");
    }
  };

  return (
    <Box
      minHeight="100vh"
      bg="linear-gradient(135deg, #f3e7e9 0%, #f9ebff 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        maxWidth="500px"
        w="full"
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Box p={8}>
          <VStack spacing={6} align="stretch">
            <Heading
              as="h2"
              fontSize="24px"
              textAlign="center"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="extrabold"
              color="black"
            >
              회원가입
            </Heading>

            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiMail color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  bg="white"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsCheckedEmail(false);
                    setIsValidEmail(!e.target.validity.typeMismatch);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="purple"
                    isDisabled={
                      !isValidEmail ||
                      email.trim().length === 0 ||
                      isCheckedEmail
                    }
                    onClick={handleCheckEmail}
                  >
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!isCheckedEmail && (
                <FormHelperText color="red.500">
                  유효한 이메일을 입력해주세요
                </FormHelperText>
              )}
            </FormControl>

            {isCheckedEmail && (
              <Button
                leftIcon={<FiMail />}
                colorScheme="purple"
                onClick={sendNumber}
                isFullWidth
                isDisabled={isCodeSentEmail}
              >
                이메일 인증코드 받기
              </Button>
            )}

            {isCodeSent && (
              <Box>
                <VStack spacing={4}>
                  <InputGroup>
                    <Input
                      placeholder="인증번호를 입력해주세요"
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={confirmNumber}>
                        확인
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {expirationTime && (
                    <TimerComponent expirationTime={expirationTime} />
                  )}
                </VStack>
              </Box>
            )}

            <FormControl isRequired>
              <FormLabel>전화번호</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSmartphone color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="01012345678"
                  bg="white"
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setIsCheckedMobile(false);
                  }}
                />
              </InputGroup>
            </FormControl>

            <Button
              leftIcon={<FiSmartphone />}
              colorScheme="purple"
              onClick={sendNumberMobile}
              isFullWidth
              isDisabled={isCodeSentPhone}
            >
              SMS 인증코드 받기
            </Button>

            {isSmsCodeSent && (
              <Box>
                <VStack spacing={4}>
                  <InputGroup>
                    <Input
                      placeholder="Enter SMS code"
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={confirmNumberMobile}
                      >
                        확인
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {expirationTime && (
                    <TimerComponent expirationTime={expirationTime} />
                  )}
                </VStack>
              </Box>
            )}

            <FormControl isRequired>
              <FormLabel>비밀번호</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type="password"
                  bg="white"
                  onKeyUp={handleCapsLockWarning}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
              {capsLockWarning && (
                <FormHelperText color="red.500">
                  Caps Lock이 켜져있습니다.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>비밀번호 확인</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type="password"
                  bg="white"
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
              </InputGroup>
              {password !== passwordCheck && (
                <FormHelperText color="red.500">
                  Passwords do not match
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>닉네임</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiUser color="gray.300" />
                </InputLeftElement>
                <Input
                  bg="white"
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setIsCheckedNickName(false);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="purple"
                    isDisabled={nickname.trim().length === 0}
                    onClick={handleCheckNickName}
                  >
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!isCheckedNickName && (
                <FormHelperText color="red.500">
                  닉네임 중복 확인을 해주세요
                </FormHelperText>
              )}
            </FormControl>

            <Button
              colorScheme="purple"
              size="lg"
              isFullWidth
              isDisabled={isDisabled}
              onClick={handleSignup}
              mt={4}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              _hover={{
                bgGradient: "linear(to-r, #764ba2, #667eea)",
              }}
            >
              회원가입
            </Button>

            <Divider />

            <Box>
              <NaverLogin />
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
