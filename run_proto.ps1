
protoc --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/auth.proto
Move-Item -Path ".\proto\auth.ts" -Destination ".\libs\shared\src\types\auth.ts" -Force

protoc --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/user.proto
Move-Item -Path ".\proto\user.ts" -Destination ".\libs\shared\src\types\user.ts" -Force

protoc --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/chat.proto
Move-Item -Path ".\proto\chat.ts" -Destination ".\libs\shared\src\types\chat.ts" -Force