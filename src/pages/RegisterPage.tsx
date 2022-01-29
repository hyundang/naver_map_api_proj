import getApi from "@apis/index";
import { Register } from "@components/templates";
import { UserDataProps } from "@interfaces/index";
import { User } from "@modules/states";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

const RegisterPage = () => {
  const [userDataList, setUserDataList] = useRecoilState(
    User.UserDataListState
  );
  const [userCnt, setUserCnt] = useRecoilState(User.UserDataCountState);
  const [userData, setUserData] = useState<UserDataProps>({
    id: -1,
    address: "",
    alias: "",
    addressDetail: "",
    caution: "",
  });

  const handleChangeUserData = (
    key: "address" | "addressDetail" | "alias" | "caution",
    value: string
  ) =>
    setUserData({
      ...userData,
      [key]: value,
    });

  const handleCreateUser = () => {
    setUserDataList(userDataList.concat([{ ...userData, id: userCnt }]));
    alert("유저를 등록하였습니다.");
    setUserCnt(userCnt + 1);
    setUserData({
      id: -1,
      address: "",
      alias: "",
      addressDetail: "",
      caution: "",
    });
  };

  return (
    <Register
      userData={userData}
      onChangeUserData={handleChangeUserData}
      onClickCreateBtn={handleCreateUser}
      getAddress={getApi.getAddress}
    />
  );
};

export default RegisterPage;