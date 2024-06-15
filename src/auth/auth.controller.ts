import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignupDto, SigninDto } from "./dto";
import { Tokens } from "./types";
import { RtGuard } from "src/common/guards";
import { GetCurrentUser, GetCurrentUserId, Public } from "src/common/decorators";

@ApiTags("Auth")
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}
    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: SigninDto): Promise<Tokens> {
        return this.authService.signin(dto);
    }

    @ApiBearerAuth()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number): Promise<boolean> {
        return this.authService.logout(userId);
    }

    @Public()
    @ApiBearerAuth()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: number, 
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}