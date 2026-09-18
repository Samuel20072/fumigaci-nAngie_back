import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty() totalCustomers: number;
  @ApiProperty() activeCustomers: number;
  @ApiProperty() inactiveCustomers: number;
  @ApiProperty() totalServices: number;
  @ApiProperty() totalFumigaciones: number;
  @ApiProperty() totalRepasos: number;
  @ApiProperty() expiringSoon: number;
  @ApiProperty() expired: number;
}
