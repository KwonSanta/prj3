import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

function HostCenterSpaceList() {
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const myPaymentPage = useNavigate();
  const member = useContext(LoginContext);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    axios
      .get(`/api/space/hostSpaceList/${member.id}`)
      .then((response) => setSpaces(response.data))
      .catch((error) =>
        console.error("공간 목록을 불러오는데 실패했습니다:", error),
      );
  }, [member.id]);

  const handleEdit = (spaceId) => {
    navigate(`/space/edit/${spaceId}`);
  };

  const filteredSpaces = spaces.filter((space) =>
    space.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const myPaymentPageFunc = (param) => {
    myPaymentPage("/member/hostReservationList/" + param);
  };
  const mySpacePageFunc = (param) => {
    myPaymentPage("/space/" + param);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon icon={faHome} style={{ marginRight: "10px" }} />내
          공간 관리
        </Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="공간 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box bg={bgColor} shadow="md" borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")}>
              <Th>#</Th>
              <Th>공간 이름</Th>
              <Th>주소</Th>
              <Th>가격 (시간당)</Th>
              <Th>예약 관리</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSpaces.map((space) => (
              <Tr key={space.spaceId}>
                <Td>{space.spaceId}</Td>
                <Td
                  fontWeight="bold"
                  _hover={{ cursor: "pointer", color: "blue.500" }}
                  onClick={() => mySpacePageFunc(space.spaceId)}
                >
                  {space.title}
                </Td>
                <Td>{space.address}</Td>
                <Td>₩{space.price.toLocaleString()}</Td>
                <Td>
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faEdit} />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => myPaymentPageFunc(space.spaceId)}
                  >
                    예약관리
                  </Button>
                </Td>
                <Td>
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faEdit} />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(space.spaceId)}
                  >
                    수정
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredSpaces.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          등록된 공간이 없습니다.
        </Text>
      )}
    </Container>
  );
}

export default HostCenterSpaceList;
