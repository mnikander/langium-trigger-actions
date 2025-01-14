import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { TriggerActionsAstType, Trigger } from './generated/ast.js';
import type { TriggerActionsServices } from './trigger-actions-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TriggerActionsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TriggerActionsValidator;
    const checks: ValidationChecks<TriggerActionsAstType> = {
        Trigger: validator.checkTriggerStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class TriggerActionsValidator {

    checkTriggerStartsWithCapital(trigger: Trigger, accept: ValidationAcceptor): void {
        if (trigger.name) {
            const firstChar = trigger.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Trigger name should start with a capital.', { node: trigger, property: 'name' });
            }
        }
    }

}
