import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class UserController {
    static async getAllUsers(request : Request, response : Response) {
        try {
            const users = await UserService.getAllUser();
            return response.json(successHandler(200, 'Lấy danh sách người dùng thành công', users));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách người dùng'));
        }
    }

    static async getUserById(request : Request, response : Response) {
        const userId = Number(request.params.id);
        try {
            const user = await UserService.getUserById(userId);
            if (!user) {
                return response.json(errorHandler(404, 'Người dùng không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin người dùng thành công', user));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin người dùng'));
        }
    }

    static async deleteUser(request : Request, response : Response) {
        const userId = Number(request.params.id);
        try {
            const user = await UserService.getUserById(userId);
            if (!user) {
                return response.json(errorHandler(404, 'Người dùng không tồn tại'));
            }
            await UserService.deleteUser(userId);
            return response.json(successHandler(200, 'Xóa người dùng thành công'));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi xóa người dùng'));
        }
    }

    // Cập nhật thông tin người dùng (tên, số điện thoại, avatarUrl)
    static async updateProfile(request: Request, response: Response) {
        try {
            const currentUser = (request as any).user;
            if (!currentUser) {
                return response.json(errorHandler(401, 'Vui lòng đăng nhập'));
            }

            const { fullName, avatarUrl, phone } = request.body;
            const updatedUser = await UserService.updateProfile(Number(currentUser.id), { fullName, avatarUrl, phone });

            return response.json(successHandler(200, 'Cập nhật hồ sơ thành công', updatedUser));
        } catch (error: any) {
            return response.json(errorHandler(500, error.message || 'Lỗi khi cập nhật hồ sơ'));
        }
    }
}